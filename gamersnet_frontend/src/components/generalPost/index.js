import React from 'react';

import Button from '../button';
import './styles.css';

import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';
import ProfileAvatar from '../profileAvatar';

export default class GeneralPost extends React.Component {
    constructor(props) {
        super(props);

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
            }
        });

        this.props.forceChat(this.props.post.userID);
    }

    render() {
        return (
            <div className = 'single-post' key = {this.props.post.id}>
                <div>
                    <ProfileAvatar userID = {this.props.post.userID} />
                    <div>
                        <div>username here</div>
                    </div>
                </div>
                <div>
                    <p><b>Description: </b>{this.props.post.description}</p>
                    <p><b>Game: </b>{this.props.post.game}</p>
                    <p><b>Looking for: </b>{this.props.post.numPlayers} player(s)</p>
                    <p><b>Location: </b>{this.props.post.location}</p>
                    <p><b>Time: </b>{this.props.post.time}</p>
                    <p><b>Duration: </b>{this.props.post.duration}</p>
                </div>
                <div className = 'general-post-info'>
                    {cookieCheck() && this.props.post.userID !== localStorage.getItem('id') &&
                        <Button onClick = {this.connect}>connect with user</Button>}
                </div>
            </div>
        )
    }
}