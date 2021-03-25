'use strict';


// include our function from the database to add post
let {getPostsBetweenDatesDB, getPostsWithText} = require('../../persistence/posts');

//search for post with the given id
async function getPostsBetweenDates(request, response) {
    let start = null;
    let end = null;

    if(request.query.startDateUTC) {
        start = new Date(request.query.startDateUTC);
    }
    if(request.query.endDateUTC) {
        end = new Date(request.query.endDateUTC);
    }

    let results = await getPostsBetweenDatesDB(start, end);
    //console.log(results);
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

/**
 * Search for posts by given text/word
 * if text == "java coffee shop" -> All posts with "java" or "coffee" or "shop" or all 
 * if text == "\"coffee shop\"" -> Exact Phrase
 * if text == "java shop -coffee" -> Term Exclusion(excluding coffee)
 * see: https://docs.mongodb.com/manual/text-search/ for details
 * @param {*} request 
 * @param {*} response 
 */
async function filterPostsbyText(request, response){
    let text = request.query.searchText

    let results = await getPostsWithText(text);
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end("No posts found with the searched words.");
    }
}

module.exports = {getPostsBetweenDates, filterPostsbyText};