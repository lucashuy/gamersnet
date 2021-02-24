import React from 'react';
import {withRouter} from 'react-router-dom';

import APIFetch from '../../api';
import cookieCheck from '../../cookieCheck';

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {username: '', password: '', message: ''}

        this.inputUsername = this.inputUsername.bind(this);
        this.inputPassword = this.inputPassword.bind(this);
        this.handle = this.handle.bind(this);

        if (cookieCheck()) {
            this.props.history.push('/');
        }
    }

    inputUsername(event) {
        this.setState({username: event.target.value});
    }

    inputPassword(event) {
        this.setState({password: event.target.value});
    }

    handle(event) {
        if (this.state.username !== '' && this.state.password !== '') {
            let body = {username: this.state.username, password: this.state.password};

            let fetchData = APIFetch('/users/authenticate', JSON.stringify(body), 'POST');

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
            <div>
                <form onSubmit = {this.handle} autoComplete = 'off'>
                    <input type = 'text' onChange = {this.inputUsername} placeholder = 'username' />
                    <input type = 'password' onChange = {this.inputPassword} placeholder = 'password' />
                    <button onClick = {this.handle}>press me</button>
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default withRouter(SignIn);