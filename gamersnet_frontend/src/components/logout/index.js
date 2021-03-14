import React from 'react';
import {withRouter} from 'react-router-dom';

class Logout extends React.Component {
    componentDidMount() {
        localStorage.removeItem('id');

        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        return '';
    }
}

export default withRouter(Logout);