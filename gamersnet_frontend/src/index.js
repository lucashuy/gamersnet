import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter} from 'react-router-dom';

import './styles.css';

import PrivateRoute from './components/PrivateRoute';

// import all the pages from their component folders
import Home from './components/home';
import SignIn from './components/signin';
import Password from './components/password';

// import header
import Header from './components/header';

// function that defines what to do when user goes to a specific page/
// this function binds the /path to the component it belongs to
function Routes() {
	return (
		<div>
			<Route exact path = '/' component = {Home} />
			<Route path = '/signin' component = {SignIn} />
			<PrivateRoute path = '/password' component = {Password} />
		</div>
	);
}

// this is where it all comes together
// <BrowserRouter> tells react (and the browser) that there are links and pages here
// we include our functions above by adding <FunctionName />, this is "JSX" notation
ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Header />
			<Routes />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);