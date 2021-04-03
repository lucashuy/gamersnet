// 'use strict';


// // include our function from the database to fetch posts
// let {getUserPosts, getPost, getAllPosts, getValidPosts} = require('../../persistence/posts');

// let {verifyUserLoggedIn} = require('../utilities/tokenUtility')

// let {getUserIDFromToken} = require('../../persistence/tokens.js')

// // this function handles the /posts/listUserPosts/ endpoint
// async function listUserPosts(request, response) {
//     let cookie = request.headers.cookie;
//     let userID = request.query.userID;

//     let loggedIn = false;

//     if (cookie) {
//         cookie = cookie.split('=')[1];
//         loggedIn = await verifyUserLoggedIn(cookie);
//     }

//     if (loggedIn){
//         let tokenDocument = await getUserIDFromToken(cookie);

//         // Note: when fetching users' posts, an empty string is passed in URL if it is requested by the user that's logged in
//         // As lucas already has userID in the frontend, this will be changed after that pr is merged
//         // - Jay
//         if(userID == ""){
//             userID = tokenDocument.userID;
//         }
        
//         let results = await getUserPosts(userID);

//         if(results.length > 0) {
//             response.json(results);
//             response.status(200).end();
//         } else {
//             response.status(404).end();
//         } 
//     } else {
//         response.status(400).end();
//     }
// }


// // this function handles the /posts/listAllPosts/ endpoint
// async function listAllPosts(request, response) {
//     // get all posts from the database and return them
//     let results = await getAllPosts();

//     if(results.length > 0) {
//         response.json(results);
//         response.status(200).end();
//     } else {
//         response.status(404).end();
//     } 
// }

// //list of posts that hasn't expired yet(the scheduled game time > current time)
// async function listValidPosts(request, response) {
//     let results = await getValidPosts();
//     if(results.length > 0) {
//         response.json(results);
//         response.status(200).end();
//     } else {
//         response.status(404).end();
//     }
// }

// //search for post with the given id
// async function getPostbyID(request, response) {
//     let _id = request.query._id
//     let results = await getPost(_id);
//     if(results != null) {
//         response.json(results);
//         response.status(200).end();
//     } else {
//         response.status(404).end();
//     }
// }

// module.exports = {listUserPosts, listAllPosts, listValidPosts, getPostbyID};
