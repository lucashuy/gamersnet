// helper function get get data from the backend
export default async function APIFetch(endpoint) {
    // define our server
    const SERVER = 'http://localhost:3000/';
    
    // a fetch() is a "promise" in javascript
    // basically, this "promise" will get fulfilled at some point in the future
    // this function is asynchonous
	return fetch(SERVER + endpoint)
	.then((response) => {
        // make sure the request went through okay
		if (response.ok === false) throw new Error('invalid request');

        // if it did, return JSON
        // here we are assuming the server will always send JSON
        return response.json();
    })
	.catch((error) => {
		console.log('error', error);
    });
}