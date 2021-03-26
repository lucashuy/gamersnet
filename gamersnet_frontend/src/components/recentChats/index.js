import React from 'react';

import APIFetch from '../../utilities/api';
import {withRouter} from 'react-router-dom';
import './styles.css';
import Button from '../button';
import Input from '../input';

import Chat from '../chat';

class RecentChats extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			status : "loading",
			select: true,
			currentChat: undefined
		};

		this.openChat = this.openChat.bind(this);
		this.handleReturn = this.handleReturn.bind(this);
		this.renderInteractions = this.renderInteractions.bind(this);
		this.localFetch = this.localFetch.bind(this);
	}

	// this function returns from a chat AND the entire chat menu
	handleReturn() {
		if (this.state.select) {
			this.props.return();
		} else {
			this.setState({select: true});
		}
	}

	localFetch() {
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

	// componentDidMount() {
	// 	this.localFetch();
	// }

	componentDidUpdate(prevProps) {
		if (this.props.visible !== prevProps.visible) this.localFetch();
	}
	
	openChat(event) {
		this.setState({
			select: false,
			currentChat: event.target.getAttribute('data-id')
		});
	}

	renderInteractions() {
		let chats = [];

		this.state.items.map(chatSession => (
			chats.push(
				<div className = "chat" data-id = {chatSession.id} onClick = {this.openChat}>{chatSession.username}</div>
			)
		));

		return chats;
	}

	renderChat() {
		if (!this.state.select) {
			return <Chat userID = {this.state.currentChat} />
		}
	}
		
	render() {
		return (
			<div style = {{display: this.props.visible ? 'initial' : 'none'}}>
				<div className = 'chat-background'></div>
				<div className = 'chat-wrapper'>
					<Button onClick = {this.handleReturn}>return</Button>
					<div className = 'chat-content'>
						<div>{this.state.status}</div>
						{this.state.select && this.renderInteractions()}
						{!this.state.select && this.renderChat()}
					</div>
				</div>
			</div>
		); 
	}
}
export default withRouter(RecentChats);