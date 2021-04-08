import React from 'react';

import './styles.css'
export default class MessageList extends React.Component{
	render() {
		return (
				<div>
					{this.props.messages.map(message => {
						let loggedInUserID = localStorage.getItem('id');

						if (loggedInUserID === message.sender) {
							return (
								<div class="msg right-msg">										
									<div class="msg-bubble">
										
										<div class="msg-text">{message.message}</div>
									</div>
								</div>
							)
						} else {
							return (
								<div class="msg left-msg">
									
									<div class="msg-bubble">
										<div class="msg-text">{message.message}</div>
									</div>
								</div>
							)
						}
					})}
				</div>
		)
	}
}
