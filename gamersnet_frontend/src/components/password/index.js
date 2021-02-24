import React from 'react';
import APIFetch from '../../api';

import './styles.css';

export default class Password extends React.Component {
    constructor(props) {
        super(props);

        this.state = {newPassword: '', message: ''};

        this.inputPassword = this.inputPassword.bind(this);
        this.handle = this.handle.bind(this);
    }

    inputPassword(event) {
        this.setState({newPassword: event.target.value});
    }

    handle(event) {
        this.setState({message: 'sending, pls wait'});

        if (this.state.newPassword !== '') {
            let body = {password: this.state.newPassword};

            let fetchData = APIFetch('/users/changePassword', JSON.stringify(body), 'POST');

            fetchData.then(async (data) => {
                if (await data.ok) {
                    this.props.history.push('/');
                    this.props.updateHeader();
                } else {
                    this.setState({message: 'something went wrong'});
                }
            });
        }

        event.preventDefault();
    }

    render() {
        return (
            <div className = 'login-form'>
                <p>Change Password</p>
                <form onSubmit = {this.handle} autoComplete = 'off' className = 'vertical-center'>
                    <input type = 'password' onChange = {this.inputPassword} placeholder = 'new password' />
                    <button onClick = {this.handle}>press me</button>
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }
}