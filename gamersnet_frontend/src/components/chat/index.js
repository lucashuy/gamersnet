import React from 'react';
import APIFetch from '../../utilities/api';
import './styles.css'
import MessageList from './MessageList'
import MessageForm from './MessageForm'

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			status : "loading"
		};
	}

	componentDidMount(){
		let userID1 = localStorage.getItem('id');
		let userID2 = this.props.userID;    // userID of the user you want to chat with
		 
		let fetchUrl = '/messages/listChatMessages?userID1=' + userID1 + '&userID2=' + userID2;
		let fetchPosts = APIFetch(fetchUrl, null,'GET');

		fetchPosts.then(async (data) => {
			if (await data.ok) {
				let json = await data.json();

				json.sort((first, second) => {
					return Date.parse(first.timestamp) - Date.parse(second.timestamp);
				})

				this.setState({messages: json, status : ""});
			} else if (await data.status === 404) {
				this.setState({status : "No messages"});
			} else {
				this.setState({status : "Network Problem"});
			}
		});
	}

	render() {
		let messages = this.state.messages;
		return (
			<div className = 'chat-inner'>
				<MessageList messages = {messages}/>
				<MessageForm />
			</div>
		);
	}
}