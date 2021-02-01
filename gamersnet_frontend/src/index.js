import React from 'react';
import ReactDOM from 'react-dom';
import {Link, Route, BrowserRouter} from 'react-router-dom';

function API(endpoint) {
	const SERVER = 'http://localhost:3000/';
	
	fetch(SERVER + endpoint)
	.then((response) => {
		if (response.ok === false) return 'bad endpoint';

		return response;
	})
	.then((data) => {
		let a = data.text().value;
		console.log(a);
		return a;
	})
	.catch((error) => {
		console.log('error', error);
	});
}

function Home() {
	let txt = API('');
	return (
		<p>{txt}</p>
	)
}

function Page1() {
	let txt = API('page1');
	return (
		<p>{txt}</p>
	)
}

function Page2() {
	let txt = API('page2');
	return (
		<p>{txt}</p>
	)
}

function Header() {
	return (
		<div>
			<Link to = '/'>home</Link><br />
			<Link to = '/page1'>page1</Link><br />
			<Link to = '/page2'>page2</Link><br />
		</div>
	);
}

function Routes() {
	return (
		<div>
			<Route exact path = '/' component = {Home} />
			<Route path = '/page1' component = {Page1} />
			<Route path = '/page2' component = {Page2} />
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Header />
			<Routes />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);