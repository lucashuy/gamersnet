import React from 'react';
import {Link} from 'react-router-dom';
import GameSearch from '../gameSearch';

import './styles.css';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userSearch: "" };

        this.inputSearch = this.inputSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    authLinks() {
        return (
            <div className = 'links'>
                <Link to = '/logout' className = 'header-link'>Logout</Link>
                <Link to = {'/profile/' + localStorage.getItem('id')} className = 'header-link'>Profile</Link>
                <Link to = '/post' className = 'header-link'>+Post</Link>
            </div>
        );
    }

    nonAuthLinks() {
        return (
            <div className = 'links'>
                <Link to = '/signin' className = 'header-link'>Sign in</Link>
                <p className = 'header-link-text'>or</p>
                <Link to = '/register' className = 'header-link'>Register</Link>
            </div>
        );
    }

    homeLink() {
        return (<div>
            <b><i style={{color:'lavender'}}>Gamersnet</i></b>
            <Link to = '/' className = 'header-link'>Home</Link></div>);
    }

    inputSearch(event) {
        this.setState({ userSearch: event.target.value });
    }

    handleSearch(event) {
        this.setState({ userSearch: event.target.value });
    }

    searchBar() {
        return (
            <div className = 'header-search'>
                <form onSubmit = {this.handleSearch}>
                    <input type = 'text' onChange = {this.inputSearch} className = 'header-search-bar' placeholder = 'Search posts here...' style = {{marginLeft: '1rem'}}></input>
                    <Link to = {`/gameSearch/${this.state.userSearch}`} className = 'header-link'>
                        <button type = 'submit' onClick = {this.handleSearch} className = 'header-search-button'>Enter</button>
                    </Link>
                </form>
            </div>
    )};

    render() {
        if (this.props.auth) {
            return (
                <div className = 'header'>
                    {this.homeLink()}
                    {this.searchBar()}
                    {this.authLinks()}
                </div>
            );
        } else {
            return (
                <div className = 'header'>
                    {this.homeLink()}
                    {this.searchBar()}
                    {this.nonAuthLinks()}
                </div>
            );
        }
    }
}