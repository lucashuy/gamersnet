import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import './styles.css';

import cookieCheck from './utilities/cookieCheck';

// import all the pages from their component folders
import Home from './components/home';
import SignIn from './components/signin';
import Register from './components/register';
import Logout from './components/logout';
import AddPost from './components/createPost';
import Profile from './components/profile';
import GameSearch from './components/gameSearch'
import RecentChats from './components/recentChats';

// import header
import Header from './components/header';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			auth: cookieCheck(),
			chatOpen: false
		};

		this.updateHeader = this.updateHeader.bind(this);
		this.logout = this.logout.bind(this);
		this.generateRoutes = this.generateRoutes.bind(this);
        this.toggleChatSessions = this.toggleChatSessions.bind(this);
	}

	toggleChatSessions() {
		let chatOpen = this.state.chatOpen;

		this.setState({chatOpen: !chatOpen});
	}

	updateHeader() {
		this.setState({auth: cookieCheck()});
	}

	logout() {
        document.cookie = 'token=; ;path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		this.setState({auth: false});
	}

	// function that defines what to do when user goes to a specific page/
	// this function binds the /path to the component it belongs to
	generateRoutes() {
		return (
			<div>
				<Route exact path = '/' component = {Home} />
				<Route path = '/post' render = {(props) => <AddPost updateHeader = {this.updateHeader} {...props} />} /> 
				<Route path = '/signin' render = {(props) => <SignIn updateHeader = {this.updateHeader} {...props} />} />
				<Route path = '/register' render = {(props) => <Register updateHeader = {this.updateHeader} {...props} />} />
				<Route path = '/logout' render = {(props) => <Logout logout = {this.logout} {...props} />} />
				<Route path = '/profile/:id' component = {Profile} />
				<Route path = '/gameSearch/:id' component = {GameSearch} />
			</div>
		);
	}

	render() {
		return (
			<React.StrictMode>
				<BrowserRouter>
					<RecentChats visible = {this.state.chatOpen} return = {this.toggleChatSessions} />
					<Header auth = {this.state.auth} toggleChatSessions = {this.toggleChatSessions} />
					{this.generateRoutes()}
				</BrowserRouter>
			</React.StrictMode>
		)
	}
}