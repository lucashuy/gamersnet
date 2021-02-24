import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Route, BrowserRouter} from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// import all the pages from their component folders
import Home from './components/home';
import SignIn from './components/signin';
import Password from './components/password';

// function to render the "header" (just the links at the top)
// this returns a set of <a> HTML tags that tell react to go to a page (using react-router)
function Header() {
	return (
		<div>
			<Link to = '/'>home</Link><br />
			<Link to = '/signin'>sign in</Link><br />
			<Link to = '/password'>password</Link><br />
		</div>
	);
}

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