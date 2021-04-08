import React from 'react';

import APIFetch from '../../../utilities/api';

import Button from '../../button';
import Input from '../../input';
import StatusMessage from '../../statusMessage';

export default class ProfileRankChange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            game: '',
            rank: '',
            message: '',
            messageClass: 'normal',
            submitState: 'normal'
        };

        this.inputGame = this.inputGame.bind(this);
        this.inputRank = this.inputRank.bind(this);
        this.handle = this.handle.bind(this);
        this.renderStatusMessage = this.renderStatusMessage.bind(this);
    }

    inputGame(event) {
        this.setState({game: event.target.value});
    }

    inputRank(event) {
        this.setState({rank: event.target.value});
    }

    handle(event) {
        this.setState({
            message: '',
            submitState: 'loading'
        });

        let body = {
            game: this.state.game,
            rank: this.state.rank
        };

        let fetchData = APIFetch('/users/updateRank', JSON.stringify(body), 'PATCH');

        fetchData.then(async (data) => {
            if (await data.ok) {
                this.setState({
                    message: 'rank changed successfully',
                    messageClass: 'success',
                    submitState: 'normal'
                });
            } else {
                this.setState({
                    message: 'bad credentials, try again',
                    messageClass: 'error',
                    submitState: 'normal'
                });
            }
        });

        event.preventDefault();
    }

    renderStatusMessage() {
        if (this.state.message !== '') {
            return <StatusMessage className = {this.state.messageClass}>{this.state.message}</StatusMessage>
        }
    }

    render() {
        return (
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Change Game Rank</div>
                <form onSubmit = {this.handle} autoComplete = 'off'>
                    <div className = 'password-inputs'>
                        <Input onChange = {this.inputGame} placeholder = 'game eg. CSGO' value = {this.props.data.game} />
                        <Input onChange = {this.inputRank} placeholder = 'rank eg. Silver I' value = {this.props.data.rank} />
                    </div>
                    <div className = 'submit'>
                        <Button onClick = {this.handle} className = {this.state.submitState}>update rank</Button>
                        {this.renderStatusMessage()}
                    </div>
                </form>
            </div>
        );
    }
}