import React from 'react';
import {Link} from 'react-router-dom';

import './styles.css';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userSearch:'' };

        this.inputSearch = this.inputSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }


    authLinks() {
        return (
            <div className = 'links'>
                <Link to = '/logout' className = 'header-link'>logout</Link>
                <Link to = {'/profile/' + localStorage.getItem('id')} className = 'header-link'>profile</Link>
                <Link to = '/post' className = 'header-link'>post</Link>
            </div>
        );
    }

    nonAuthLinks() {
        return (
            <div className = 'links'>
                <Link to = '/signin' className = 'header-link'>sign in</Link>
                <p className = 'header-link-text'>or</p>
                <Link to = '/register' className = 'header-link'>register</Link>
            </div>
        );
    }

    homeLink() {
        return <Link to = '/' className = 'header-home'>home</Link>;
    }

    inputSearch(event) {
        this.setState({ userSearch: event.target.value });
    }

    handleSearch(event) {
        alert("Searching for " + this.state.userSearch + "\nSorry we do not have this feature ready yet");
        event.preventDefault();
    }

    searchBar() {
        return (
            <div className = 'header-search'>
                <form onSubmit = {this.handleSearch}>
                    <input type = 'text' onChange = {this.inputSearch} className = 'header-search-bar' placeholder = 'Search here...' style = {{marginLeft: '1rem'}}></input>
                    <button type = 'submit' onClick = {this.handleSearch} className = 'header-search-button'>Enter</button>
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