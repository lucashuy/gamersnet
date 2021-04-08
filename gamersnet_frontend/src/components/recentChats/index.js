import React from 'react';

import APIFetch from '../../utilities/api';

import './styles.css';
import Button from '../button';
import Chat from '../chat';
import RoundedBox from '../roundedBox';
import ProfileAvatar from '../profileAvatar';

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

	componentDidUpdate(prev) {
		if (this.props.forcedID !== prev.forcedID) {
			this.localFetch();

			setTimeout(function() {
				this.setState({
					select: false,
					currentChat: this.props.forcedID,
					currentChatUsername: '[TODO: fixme]'
				});
			}.bind(this), 100);
		}
	}

	openChat(id, username) {
		this.setState({
			select: false,
			currentChat: id,
			currentChatUsername: username
		});
	}

	renderInteractions() {
		let chats = [];

		if (this.state.items.length === 0) return <RoundedBox className = 'empty-chat'><div>{'no chats :<'}</div></RoundedBox>

		this.state.items.map(chatSession => (
			chats.push(
				<RoundedBox className = 'chat' onClick = {() => this.openChat(chatSession.id, chatSession.username)}>
					<ProfileAvatar userID = {chatSession.id} />
					<div className = 'chat-select-username'>{chatSession.username}</div>
				</RoundedBox>
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
				<div className = 'chat-header-wrapper'>
					<div className = 'chat-header'>Chats</div>
					{this.state.select === false && <Button onClick = {this.handleReturn}>return</Button>}
				</div>

				{this.state.select && this.renderInteractions()}
				{!this.state.select && this.renderChat()}
			</div>
		); 
	}
}