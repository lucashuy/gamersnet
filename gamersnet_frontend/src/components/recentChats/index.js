import React from 'react';

import APIFetch from '../../utilities/api';

import './styles.css';
import Button from '../button';
import Chat from '../chat';

export default class RecentChats extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			status : 0,
			select: true,
			currentChat: undefined
		};

		this.openChat = this.openChat.bind(this);
		this.handleReturn = this.handleReturn.bind(this);
		this.renderInteractions = this.renderInteractions.bind(this);
		this.localFetch = this.localFetch.bind(this);
	}

	handleReturn() {
		this.setState({select: true});
	}

	localFetch() {
		let fetchChats = APIFetch('/messages/listInteractedIDs', null, 'GET');

		fetchChats.then(async (data) => {
			if (await data.ok) {
				let recentChats = await data.json();
				
				this.setState({items: recentChats.users, status : 200});
			} else if (await data.status === 404){
				this.setState({status : 404});
			} else {
				this.setState({status : 500});
			}
		});
	}

	componentDidMount() {
		this.localFetch();
	}

	openChat(event) {
		this.setState({
			select: false,
			currentChat: event.target.getAttribute('data-id'),
			currentChatUsername: event.target.getAttribute('data-username')
		});
	}

	renderInteractions() {
		let chats = [];

		this.state.items.map(chatSession => (
			chats.push(
				<div className = "chat" data-id = {chatSession.id} data-username = {chatSession.username} onClick = {this.openChat}>{chatSession.username}</div>
			)
		));

		return chats;
	}

	renderChat() {
		if (!this.state.select) {
			return <Chat userID = {this.state.currentChat} username = {this.state.currentChatUsername} />
		}
	}
		
	render() {
		return (
			<div className = 'chat-wrapper'>
				{this.state.select === false && <Button onClick = {this.handleReturn}>return</Button>}
				<h2>Chats</h2>
				<div className = 'chat-content'>
					{this.state.select && this.renderInteractions()}
					{!this.state.select && this.renderChat()}
				</div>
			</div>
		); 
	}
}