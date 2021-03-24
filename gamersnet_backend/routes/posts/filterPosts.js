'use strict';


// include our function from the database to add post
let {getPostsBetweenDatesDB} = require('../../persistence/posts');

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
    console.log(results);
    if(results.length > 0) {
        response.json(results);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
}

async function filterPostsbyKeyWord(request, response){
    let keywords = request.query.searchKeyWords

    let result = await getPostsWithKeyWords(keywords);
    
}

module.exports = {getPostsBetweenDates};