import React from 'react';

import APIFetch from '../../../utilities/api';

import Button from '../../button';
import Input from '../../input';
import StatusMessage from '../../statusMessage';

import './styles.css';

const SUBMIT_STATE = {
    READY: 'normal',
    DISABLED: 'disabled',
    LOADING: 'loading'
};

export default class ProfileChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            message: '',
            messageClass: 'normal',
            submitState: SUBMIT_STATE.DISABLED
        };

        this.inputOldPassword = this.inputOldPassword.bind(this);
        this.inputNewPassword = this.inputNewPassword.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.handle = this.handle.bind(this);
        this.renderStatusMessage = this.renderStatusMessage.bind(this);
    }

    inputOldPassword(event) {
        this.setState({oldPassword: event.target.value});
        this.checkInput(event.target.value, this.state.newPassword);
    }

    inputNewPassword(event) {
        this.setState({newPassword: event.target.value});
        this.checkInput(this.state.oldPassword, event.target.value);
    }

    checkInput(oldPass, newPass) {
        if (oldPass !== '' && newPass !== '') {
            this.setState({submitState: SUBMIT_STATE.READY});
        }
    }

    handle(event) {
        this.setState({
            message: '',
            submitState: SUBMIT_STATE.LOADING
        });

        if (this.state.oldPassword !== '' && this.state.newPassword !== '') {
            let body = {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            };

            let fetchData = APIFetch('/users/updatePassword', JSON.stringify(body), 'PATCH');

            fetchData.then(async (data) => {
                if (await data.ok) {
                    this.setState({
                        message: 'password changed successfully',
                        messageClass: 'success',
                        submitState: SUBMIT_STATE.READY
                    });
                } else {
                    this.setState({
                        message: 'bad credentials, try again',
                        messageClass: 'error',
                        submitState: SUBMIT_STATE.DISABLED
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
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Change Password</div>
                <form onSubmit = {this.handle} autoComplete = 'off'>
                    <div className = 'password-inputs'>
                        <Input type = 'password' onChange = {this.inputOldPassword} placeholder = 'old password' />
                        <Input type = 'password' onChange = {this.inputNewPassword} placeholder = 'new password' />
                    </div>
                    <div className = 'submit'>
                        <Button onClick = {this.handle} className = {this.state.submitState}>change password</Button>
                        {this.renderStatusMessage()}
                    </div>
                </form>
            </div>
        );
    }
}