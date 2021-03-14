import React from 'react';

import APIFetch from '../../utilities/api';

export default class ChangeAvatar extends React.Component {
    constructor(props) {
        super(props);
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
            <div className = 'login-form'>
                <p>Login to GamersNet</p>
                <form onSubmit = {this.handle} autoComplete = 'off' className = 'vertical-center'>
                    <input type = 'text' onChange = {this.inputUsername} placeholder = 'username' />
                    <input type = 'password' onChange = {this.inputPassword} placeholder = 'password' />
                    <button onClick = {this.handle}>press me</button>
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }
}