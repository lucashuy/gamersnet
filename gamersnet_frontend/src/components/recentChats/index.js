import React from 'react';

import APIFetch from '../../utilities/api';
import {withRouter} from 'react-router-dom';
import './styles.css';

class RecentChats extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			items: [],
			status : "loading"
		};
	}

	componentDidMount() {

			let fetchChats = APIFetch('/messages/listInteractedIDs', null, 'GET');

			// Not tested yet
			fetchChats.then(async (data) => {
				if (await data.ok) {
					console.log("recentChats")
					let recentChats = await data.json();
					this.setState({items: recentChats, status : ""});
				} else if (await data.status === 404){
					this.setState({status : "No chats found"});
				} else {
					this.setState({status : "Network Problem"});
				}
			});
	}
	
		
	render() {
		let recentChats = this.state.items;
		return (
			<div>
				<div>{this.state.status}</div>
				<ul>
						{recentChats.map(item => (
							<li key={item._id}>
								<div className = "chat"> {item} </div><br/>
							</li>
						))}
				</ul>
			</div>
		); 
	}
}
export default withRouter(RecentChats);