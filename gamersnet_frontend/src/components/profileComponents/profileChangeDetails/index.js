import React from 'react';

import APIFetch from '../../../utilities/api';

import Input from '../../input';
import Button from '../../button';
import StatusMessage from '../../statusMessage';

import './styles.css';

export default class ProfileChangeDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            submitState: 'normal',
            data: this.props.data
        }

        this.handle = this.handle.bind(this);

        this.changeAge = this.changeAge.bind(this);
        this.changeTimezone = this.changeTimezone.bind(this);
        this.changePlatform = this.changePlatform.bind(this);
        this.changeGames = this.changeGames.bind(this);
    }

    changeAge(event) {
        let modifiedData = JSON.parse(JSON.stringify(this.state.data));
        modifiedData.age = event.target.value;

        this.setState({data: modifiedData});

        event.preventDefault();
    }
    
    changeTimezone(event) {
        let modifiedData = JSON.parse(JSON.stringify(this.state.data));
        modifiedData.timezone = event.target.value;
        
        this.setState({data: modifiedData});

        event.preventDefault();
    }

    changePlatform(event) {
        let modifiedData = JSON.parse(JSON.stringify(this.state.data));
        modifiedData.platform = event.target.value;
        
        this.setState({data: modifiedData});

        event.preventDefault();
    }
    changeGames(event) {
        let modifiedData = JSON.parse(JSON.stringify(this.state.data));
        modifiedData.games = event.target.value;
        
        this.setState({data: modifiedData});

        event.preventDefault();
    }

    handle(event) {
        console.log('send', this.state.data);
        this.setState({
            message: '',
            submitState: 'loading'
        });

        let fetchData = APIFetch('/users/updateDetails', JSON.stringify(this.state.data), 'PATCH');

        fetchData.then(async (data) => {
            if (await data.ok) {
                this.setState({
                    message: 'personal details updated',
                    messageClass: 'success',
                    submitState: 'normal'
                });
            } else if (await data.status === 400) {
                this.setState({
                    message: 'bad token, logout and log back in',
                    messageClass: 'error',
                    submitState: 'disabled'
                });
            } else if (await data.status === 401) {
                this.setState({
                    message: 'invalid data sent',
                    messageClass: 'error',
                    submitState: 'normal'
                });
            } else {
                this.setState({
                    message: 'unknown error',
                    messageClass: 'error',
                    submitState: 'disabled'
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
        console.log('render', this.state.data);
        return (
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Change Details</div>
                <form className = 'profile-details-change-wrapper' onSubmit = {this.handle}>
                    <div>
                        <p>Age</p>
                        <Input
                            id = 'age'
                            type = 'number'
                            onChange = {this.changeAge}
                            value = {this.props.data.age}
                        />
                    </div>
                    <div>
                        <p>Platform</p>
                        <Input
                            id = 'platform'
                            placeholder = 'eg. PC, Console, Mobile'
                            onChange = {this.changePlatform}
                            value = {this.props.data.platform}
                        />
                    </div>
                    <div>
                        <p>Timezone</p>
                        <Input
                            id = 'timezone'
                            placeholder = 'eg. UTC - 6, Winnipeg Time, CST'
                            onChange = {this.changeTimezone}
                            value = {this.props.data.timezone}
                        />
                    </div>
                    <div>
                        <p>Game Interests</p>
                        <Input
                            id = 'games'
                            placeholder = 'eg. Call of Duty, BTD6, Dota 2'
                            onChange = {this.changeGames}
                            value = {this.props.data.games}
                        />
                    </div>
                    <div className = 'details-submit'>
                        <Button onClick = {this.handle} className = {this.state.submitState}>update details</Button>
                        {this.renderStatusMessage()}
                    </div>
                </form>
            </div>
        );
    }
}