import React from 'react';

import './styles.css'
export default class MessageList extends React.Component{
	render() {
		console.log(this.props.messages);
		return (
			<div>
				{this.props.messages.map(message => {
					let loggedInUserID = localStorage.getItem('id');

					if (loggedInUserID === message.sender) {
							return (
								<div>
									<div className = 'message self'>
										{message.message}
									</div>
								</div>
							)
					} else {
						return (
							<div className = 'message'>
								{message.message}
							</div>
						)
					}
				})}
			</div>
		)
	}
}
