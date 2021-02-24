// helper function get get data from the backend
export default async function APIFetch(endpoint, body = null, method = 'GET') {
    // define our server
    let server = 'http://localhost:3000';
    
    if (process.env.NODE_ENV === 'production') {
        server = process.env.REACT_APP_API_SERVER;
    }
    
    // a fetch() is a "promise" in javascript
    // basically, this "promise" will get fulfilled at some point in the future
    // this function is asynchonous
    return fetch(server + endpoint, {
        method: method,
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: body
    })
    .then((response) => {
        return response;
    })
	.catch((error) => {
		console.log('error', error);
    });
}