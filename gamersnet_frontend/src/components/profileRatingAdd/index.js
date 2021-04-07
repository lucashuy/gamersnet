import React from 'react';

import APIFetch from '../../utilities/api';
import Button from '../button';
import StatusMessage from '../statusMessage';

import './styles.css';

const STAR_LENGTH = 32;

export default class ProfileRatingAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            strength: 0,
            punctuality: 0,
            friendliness: 0,
            fun: 0,
            playAgain: false,
            comment: '',
            submitState: 'normal',
            messageClass: 'normal',
            message: ''
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleText = this.handleText.bind(this);
        this.renderStatusMessage = this.renderStatusMessage.bind(this);
        this.handle = this.handle.bind(this);
    }
    
    componentDidMount() {
        let fetchData = APIFetch(`/ratings/getUserRatingByRater?userID=${this.props.userID}&raterID=${localStorage.getItem('id')}`);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                this.setState({
                    comment: json.comment,
                    strength: json.strength,
                    punctuality: json.punctuality,
                    friendliness: json.friendliness,
                    fun: json.fun,
                    playAgain: json.playAgain,
                });
            }
        });
    }

    handleClick(event) {
        // find x coord of click within the image of stars
        let x = event.nativeEvent.layerX;
        let id = event.target.id;

        let newState = {};

        if (id === 'again') {
            newState.playAgain = event.target.checked;
        } else {
            // set the number of stars based on where we clicked
            // each star is (at the time of writing) 32 pixels
            newState[id] = Math.floor(x / STAR_LENGTH) + 1;
            event.preventDefault();
        }
        
        this.setState(newState);
    }

    handleText(event) {
        this.setState({comment: event.target.value});

        event.preventDefault();
    }

    handle(event) {
        if (!this.state.strength || !this.state.punctuality || !this.state.friendliness || !this.state.fun) {
            this.setState({message: 'please rate all fields', messageClass: 'error'});
        } else {
            this.setState({
                message: '',
                submitState: 'loading'
            });

            let body = {
                strength: this.state.strength,
                punctuality: this.state.punctuality,
                friendliness: this.state.friendliness,
                fun: this.state.fun,
                playAgain: this.state.playAgain,
                comment: this.state.comment,
            };
            
            let fetchData = APIFetch('/ratings/addRatings?userID=' + this.props.userID, JSON.stringify(body), 'POST');

            fetchData.then(async (data) => {
                if (await data.ok) {
                    this.setState({
                        message: 'success',
                        messageClass: 'success',
                        submitState: 'normal'
                    });
                } else {
                    this.setState({
                        message: 'bad credentials, log in again',
                        messageClass: 'error',
                        submitState: 'normal'
                    });
                }
            });
        }

        event.preventDefault();
    }

    renderStatusMessage() {
        if (this.state.message !== '') {
            return <StatusMessage className = {this.state.messageClass}>{this.state.message}</StatusMessage>
        }
    }

    render() {
        return (
            <div className = 'rating-submit-wrapper'>
                <div className = 'profile-header'>Your Rating</div>
                <div className = 'rating-submit-stars'>
                    <div>
                        <div className = 'star' id = 'strength' onClick = {this.handleClick} style = {{'--rating': this.state.strength}}></div>
                        <div>Strength</div>
                    </div>
                    <div>
                        <div className = 'star' id = 'punctuality' onClick = {this.handleClick} style = {{'--rating': this.state.punctuality}}></div>
                        <div>Punctuality</div>
                    </div>
                    <div>
                        <div className = 'star' id = 'friendliness' onClick = {this.handleClick} style = {{'--rating': this.state.friendliness}}></div>
                        <div>Friendliness</div>
                    </div>
                    <div>
                        <div className = 'star' id = 'fun' onClick = {this.handleClick} style = {{'--rating': this.state.fun}}></div>
                        <div>Fun</div>
                    </div>
                    <div>
                        <input id = 'again' type = 'checkbox' checked = {this.state.playAgain} onChange = {this.handleClick} />
                        <label for = 'again' style = {{display: 'block'}}>would play again</label>
                    </div>
                </div>
                <div>
                    <textarea placeholder = 'comments (optional)' value = {this.state.comment} onChange = {this.handleText} />
                </div>
                <div className = 'submit'>
                    <Button onClick = {this.handle} className = {this.state.submitState}>submit rating</Button>
                    {this.renderStatusMessage()}
                </div>
            </div>
        );
    }
}