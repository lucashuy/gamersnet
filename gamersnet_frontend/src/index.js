import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom';

import './styles.css';

import PrivateRoute from './components/PrivateRoute';
import cookieCheck from './utilities/cookieCheck';

// import all the pages from their component folders
import Home from './components/home';
import SignIn from './components/signin';
import Register from './components/register';
import Password from './components/password';
import Logout from './components/logout';
import AddPost from './components/createPost';

// import header
import Header from './components/header';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {auth: cookieCheck()};

		this.updateHeader = this.updateHeader.bind(this);
		this.logout = this.logout.bind(this);
		this.generateRoutes = this.generateRoutes.bind(this);
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
				<PrivateRoute path = '/post' component = {(props) => <AddPost updateHeader = {this.updateHeader} {...props} />} />
				<Route path = '/signin' render = {(props) => <SignIn updateHeader = {this.updateHeader} {...props} />} />
				<Route path = '/register' render = {(props) => <Register updateHeader = {this.updateHeader} {...props} />} />
				<PrivateRoute path = '/logout' component = {(props) => <Logout logout = {this.logout} {...props} />} />
				<PrivateRoute path = '/password' component = {Password} />
			</div>
		);
	}

	render() {
		return (
			<React.StrictMode>
				<BrowserRouter>
					<Header auth = {this.state.auth} />
					{this.generateRoutes()}
				</BrowserRouter>
			</React.StrictMode>
		)
	}
}

// this is where it all comes together
// <BrowserRouter> tells react (and the browser) that there are links and pages here
// we include our functions above by adding <FunctionName />, this is "JSX" notation
ReactDOM.render(
	<App />,
	document.getElementById('root')
);