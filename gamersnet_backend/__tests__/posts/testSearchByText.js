'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, posts;
let user1ID, user2ID;
let post1ID, post2ID, post3ID;
let post1Str, post2Str, post3Str;

let currDate = new Date();
let date1 = new Date();

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

//logged in
let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}


let post1 = {
    userID : ObjectID(),
    description: "Looking for Players",
    gameName: "Apex Legends",
    numPlayers: 5,
    gameTimeUTC: date1,
    duration: "1hr",
    location: "Canada"
}

let post2 = {
    userID : ObjectID(),
    description: "Looking to play",
    gameName: "Call of Duty",
    numPlayers: 5,
    gameTimeUTC: date1,
    duration: "1hr",
    location: "Canada"
}

let post3 = {
    userID : ObjectID(),
    description: "Looking for Players",
    gameName: "Fortnite",
    numPlayers: 5,
    gameTimeUTC: date1,
    duration: "1hr",
    location: "USA"
}



beforeAll(async () => {
    if (!db) db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    tokens = db.collection("tokens");
    posts = db.collection("posts");

    //set up DB with mock data
    await seedDB();
});

async function seedDB() {

    //user1,token 1, post 1
    let user1Inserted = await users.insertOne(user1);
    user1ID = ObjectId(user1Inserted.insertedId);

    token1.userID = user1ID;
    let token1Inserted = await tokens.insertOne(token1)

    post1.userID = user1ID;
    let post1Inserted = await posts.insertOne(post1);
    post1ID = post1Inserted.insertedId;

    post1Str = '{"_id":"' + post1ID.toHexString() + '","userID":"' + user1ID.toHexString() + '","description":"Looking for Players","gameName":"Apex Legends","numPlayers":5,"gameTimeUTC":"' + date1.toISOString() + '","duration":"1hr","location":"Canada"}'

    //user2,token 2, post 2
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    token2.userID = user2ID;
    let token2Inserted = await tokens.insertOne(token2)

    post2.userID = user2ID;
    let post2Inserted = await posts.insertOne(post2);
    post2ID = post2Inserted.insertedId;
    post2Str = '{"_id":"' + post2ID.toHexString() + '","userID":"' + user2ID.toHexString() + '","description":"Looking to play","gameName":"Call of Duty","numPlayers":5,"gameTimeUTC":"' + date1.toISOString() + '","duration":"1hr","location":"Canada"}'


    post3.userID = user2ID;
    let post3Inserted = await posts.insertOne(post3);
    post3ID = post3Inserted.insertedId;
    post3Str = '{"_id":"' + post3ID.toHexString() + '","userID":"' + user2ID.toHexString() + '","description":"Looking for Players","gameName":"Fortnite","numPlayers":5,"gameTimeUTC":"' + date1.toISOString() + '","duration":"1hr","location":"USA"}'


}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test search/filter posts', () => {
    test('Search for posts with \'Apex\' in them.', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: "Apex"})
        .expect('['+post1Str+']')
        .expect(200).end(done); 
    });

    test('Search for posts with \'Players\' OR \'Canada\' in them -> return all', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: "Players Canada"})
        .expect('['+post2Str+','+post1Str+','+post3Str+']')
        .expect(200).end(done); 
    });

    test('Search for posts with EXACT PHRASE \"Looking to play\" in them -> return post 2', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: "\"Looking to play\""})
        .expect('['+post2Str+']')
        .expect(200).end(done); 
    });

    test('Search for posts with  \'Looking\' and EXCLUDING \'Canada\' from them -> return post 3', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: "Looking -Canada"})
        .expect('['+post3Str+']')
        .expect(200).end(done); 
    });

    test('Search for posts with  non-existent text -> return 404', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: "Something amazing"})
        .expect(404).end(done); 
    });

    test('Search for posts with  no text', (done) => {
        return request(app).get('/posts/filterPostsbyText')
        .query({searchText: ""})
        .expect(404).end(done); 
    });

});