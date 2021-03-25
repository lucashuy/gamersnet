import React from 'react';

import APIFetch from '../../utilities/api';

import './styles.css';

export default class RecentChats extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			status : "loading"
		};
	}

	componentDidMount() {
			let userID = localStorage.getItem('id');
				
			let fetchPosts = APIFetch('/messages/listInteractedIDs?userID=' + userID, null, 'GET');

			fetchPosts.then(async (data) => {
				if (await data.ok) {
					let posts = await data.json();
					this.setState({items: posts, status : ""});
				} else if (await data.status === 404){
					this.setState({status : "No posts found"});
				} else {
					this.setState({status : "Network Problem"});
				}
			});
	}
		
	render() {
		let chats = this.state.items;
		return (
			<div>
				<ul>
					{chats.map(item => (
						<div classname = "chat" key = {item._id}> {item} </div>
					))}
				</ul>
			</div>
		); 
	}
}