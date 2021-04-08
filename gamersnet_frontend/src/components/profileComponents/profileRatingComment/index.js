import React from 'react';
import {Link} from 'react-router-dom';

import APIFetch from '../../../utilities/api';
import ProfileAvatar from '../profileAvatar';

import './styles.css';

export default class ProfileRatingComment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            timeDisplay: this.calcTimeSince(this.props.rateDate)
        };
    }

    calcTimeSince(since) {
        let time = (Date.now() - Date.parse(since)) / 1000;
        
        // year+ ago
        if (time / (60 * 60 * 24 * 30 * 12) > 1) {
            return Math.floor(time / (60 * 60 * 24 * 30 * 12)) + ' year(s) ago';
        }

        // month+ ago
        if (time / (60 * 60 * 24 * 30) > 1) {
            return Math.floor(time / (60 * 60 * 24 * 30)) + ' month(s) ago';
        }

        // day+ ago
        if (time / (60 * 60 * 24) > 1) {
            return Math.floor(time / (60 * 60 * 24)) + ' day(s) ago';
        }

        // hour+ ago
        if (time / (60 * 60) > 1) {
            return Math.floor(time / (60 * 60)) + ' hour(s) ago';
        }

        // minute+ ago
        if (time / 60 > 1) {
            return Math.floor(time / 60) + ' minutes(s) ago';
        }

        return Math.floor(time) + ' second(s) ago';
    }

    componentDidMount() {
        let fetchData = APIFetch('/users/getUsername/' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                this.setState({username: json.username});
            } else {
                console.log('profile-comments', 'network problem happened');
            }
        });
    }

    render() {
        return (
            <div className = 'rating-overview-comment'>
                <div className = 'rating-comment-info'>
                    <ProfileAvatar className = 'comment-avatar' userID = {this.props.userID} />
                    <div style = {{marginLeft: '1rem'}}>
                        <Link to = {`/profile/${this.props.userID}`}>{this.state.username}</Link>
                        <div>{this.state.timeDisplay}</div>
                    </div>
                </div>
                <div className = 'rating-comment-text'>
                    <p>{this.props.comment}</p>
                </div>
            </div>
        );
    }
}