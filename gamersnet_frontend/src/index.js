import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Route, BrowserRouter} from 'react-router-dom';

// import all the pages from their component folders
import Home from './components/home';
import Page1 from './components/page1';
import Page2 from './components/page2';

// function to render the "header" (just the links at the top)
// this returns a set of <a> HTML tags that tell react to go to a page (using react-router)
function Header() {
	return (
		<div>
			<Link to = '/'>home</Link><br />
			<Link to = '/page1'>page1</Link><br />
			<Link to = '/page2'>page2</Link><br />
		</div>
	);
}

// function that defines what to do when user goes to a specific page/
// this function binds the /path to the component it belongs to
function Routes() {
	return (
		<div>
			<Route exact path = '/' component = {Home} />
			<Route path = '/page1' component = {Page1} />
			<Route path = '/page2' component = {Page2} />
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