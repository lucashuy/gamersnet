import React from 'react';
import {Link} from 'react-router-dom';

import './styles.css';

export default class Header extends React.Component {
    authLinks() {
        return (
            <div>
                <Link to = '/post' className = 'header-link'>Post</Link>
                <Link to = '/logout' className = 'header-link'>Logout</Link>
                <Link to = '/password' className = 'header-link'>password</Link>
            </div>
        );
    }

    nonAuthLinks() {
        return (
            <div>
                <Link to = '/signin' className = 'header-link'>sign in</Link>
                <p className = 'header-link-text'>or</p>
                <Link to = '/register' className = 'header-link'>register</Link>
            </div>
        );
    }

    homeLink() {
        return <Link to = '/' className = 'header-home'>home</Link>;
    }

    render() {
        if (this.props.auth) {
            return (
                <div className = 'header'>
                    {this.homeLink()}
                    {this.authLinks()}
                </div>
            );
        } else {
            return (
                <div className = 'header'>
                    {this.homeLink()}
                    {this.nonAuthLinks()}
                </div>
            );
        }
    }
}