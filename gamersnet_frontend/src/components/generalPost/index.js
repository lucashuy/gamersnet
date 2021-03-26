import React from 'react';

import Button from '../button';
import './styles.css';

import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';

export default class GeneralPost extends React.Component {
    constructor(props) {
        super(props);

        this.renderConnect = this.renderConnect.bind(this);
        this.connect = this.connect.bind(this);
    }

    connect() {
        let body = {
            receiver : this.props.post.userID,
			timestamp : Date.now(),
			message : 'Hi, lets play together!'
        };

        let fetchData = APIFetch('/messages/addMessage', JSON.stringify(body), 'POST');
        
        fetchData.then(async (data) => {
            if (await data.ok) {
				console.log('post', 'sent message');
				// body.sender = localStorage.getItem('id');
				// this.ws.send(JSON.stringify({type: "message", receiver: this.props.userID, message : body.message, timestamp : Date.now()}));
				// this.addMessage(body)
            }
        });

        this.props.toggleChat(this.props);
    }

    renderConnect() {
        if (cookieCheck()) {
            return <Button onClick = {this.connect}>connect with user</Button>
        }
    }

    render() {
        return (
            <div className = 'single-post' key = {this.props.post.id}>
                <p><b>Description: </b>{this.props.post.description}</p>
                <p><b>Game: </b>{this.props.post.game}</p>
                <p><b>Looking for: </b>{this.props.post.numPlayers} player(s)</p>
                <p><b>Location: </b>{this.props.post.location}</p>
                <p><b>Time: </b>{this.props.post.time}</p>
                <p><b>Duration: </b>{this.props.post.duration}</p>
                <div className = 'general-post-info'>
                    {this.renderConnect()}
                </div>
            </div>
        )
    }
}