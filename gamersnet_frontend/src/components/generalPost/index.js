import React from 'react';
import {Link} from 'react-router-dom';

import Button from '../button';
import './styles.css';

import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';
import ProfileAvatar from '../profileComponents/profileAvatar';

export default class GeneralPost extends React.Component {
    constructor(props) {
        super(props);

        this.state = {username: ''}

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

        this.props.forceChat(this.props.post.userID, this.state.username);
    }

    componentDidMount() {
		let fetchChats = APIFetch('/users/getUsername/' + this.props.post.userID, null, 'GET');

		fetchChats.then(async (data) => {
			if (await data.ok) {
				let json = await data.json();
				
				this.setState({username: json.username});
			} else {
                console.log('general post', 'network issue: ' + data.status);
			}
		});
    }

    render() {
        return (
            <div className = 'single-post' key = {this.props.post.id}>
                <div className = 'post-author'>
                    <ProfileAvatar userID = {this.props.post.userID} />
                    <Link className = 'post-username' to = {`/profile/${this.props.post.userID}`}>{this.state.username}</Link>
                </div>
                <div className = 'spacer' />
                <div className = 'post-details'>
                    <div className = 'inline-flex'>
                        <p><b>Game: </b>{this.props.post.game}</p>
                        <p><b>Looking for: </b>{this.props.post.numPlayers} player(s)</p>
                    </div>
                    <div className = 'inline-flex'>
                        <p><b>Date: </b>{new Date(this.props.post.time).toDateString()}</p>
                        <p><b>Duration: </b>{this.props.post.duration}</p>
                    </div>
                    <p><b>Location: </b>{this.props.post.location}</p>
                    <p><b>Description: </b>{this.props.post.description}</p>
                </div>
                <div className = 'general-post-info'>
                    {cookieCheck() && this.props.post.userID !== localStorage.getItem('id') &&
                        <Button onClick = {this.connect}>connect with user</Button>}
                </div>
            </div>
        )
    }
}