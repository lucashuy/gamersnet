import React from 'react';

import './styles.css'
export default class MessageList extends React.Component{
	render() {
		console.log(this.props.messages);
		return (
			<div className = 'chat-scrollable'>
				<div>
					{this.props.messages.map(message => {
						console.log(message);
						let loggedInUserID = localStorage.getItem('id');

						if (loggedInUserID === message.sender) {
							return (
								<div className = 'message self'>
									<p>{message.message}</p>
								</div>
							)
						} else {
							return (
								<div className = 'message'>
									<p>{message.message}</p>
								</div>
							)
						}
					})}
				</div>
			</div>
		)
	}
}
