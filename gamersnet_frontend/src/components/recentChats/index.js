import React from 'react';

import APIFetch from '../../utilities/api';
import {withRouter} from 'react-router-dom';
import './styles.css';
import Button from '../button';

class RecentChats extends React.Component{

	constructor(props) {
		super(props);

		this.state = {
			items: [],
			status : "loading",
			select: true
		};

		this.openChat = this.openChat.bind(this);
		this.handleReturn = this.handleReturn.bind(this);
	}

	// this function returns from a chat AND the entire chat menu
	handleReturn() {
		if (this.state.select) {
			this.props.return();
		}
	}

	componentDidMount() {
			let fetchChats = APIFetch('/messages/listInteractedIDs', null, 'GET');

			fetchChats.then(async (data) => {
				if (await data.ok) {
					let recentChats = await data.json();
					this.setState({items: recentChats.users, status : ""});
				} else if (await data.status === 404){
					this.setState({status : "No chats found"});
				} else {
					this.setState({status : "Network Problem"});
				}
			});
	}
	
	openChat(event) {
		console.log(event.target.getAttribute('data-id'));
	}
		
	render() {
		let recentChats = this.state.items;
		return (
			<div>
				<div className = 'chat-background'></div>
				<div className = 'chat-wrapper'>
					<Button onClick = {this.handleReturn}>return</Button>
					<div className = 'chat-content'>
						<div>{this.state.status}</div>
						{recentChats.map(chatSession => (
							<div className = "chat" data-id = {chatSession.id} onClick = {this.openChat}>{chatSession.username}</div>
						))}
					</div>
				</div>
			</div>
		); 
	}
}
export default withRouter(RecentChats);