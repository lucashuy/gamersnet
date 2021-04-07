import React from 'react';

import APIFetch from '../../utilities/api';
import Button from '../button';

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
            submitState: 'normal'
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handle = this.handle.bind(this);
    }
    
    handleClick(event) {
        let x = event.nativeEvent.layerX;
        let id = event.target.id;

        let newState = {};
        newState[id] = Math.floor(x / STAR_LENGTH) + 1;
        
        this.setState(newState);

        event.preventDefault();
    }

    handleText(event) {
        this.setState({comment: event.target.value});

        event.preventDefault();
    }

    handle(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className = 'rating-submit-wrapper'>
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
                        <input type = 'checkbox' />
                        <div>would play again</div>
                    </div>
                </div>
                <div>
                    <textarea placeholder = 'comments (optional)' onChange = {this.handleChange} />
                </div>
                <div className = 'submit'>
                    <Button onClick = {this.handle} className = {this.state.submitState}>send review</Button>
                    {/* {this.renderStatusMessage()} */}
                </div>
            </div>
        );
    }
}