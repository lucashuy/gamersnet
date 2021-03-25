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
let date2 = new Date();
let date3 = new Date();
date1.setDate(currDate.getDate() + 10);
date2.setDate(currDate.getDate() + 15);
date3.setDate(currDate.getDate() + 20);

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

//logged in
let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}

//the scheduled time=10 days from today
let post1 = {
    userID : ObjectID(),
    description: "post by user1",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: date1,
    duration: "1hr",
    location: "Earth"
}

//the scheduled time=15 days from today
let post2 = {
    userID : ObjectID(),
    description: "post by user2",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: date2,
    duration: "1hr",
    location: "Mars"
}

//the scheduled time=20 days from today
let post3 = {
    userID : ObjectID(),
    description: "post by user2",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: date3,
    duration: "1hr",
    location: "Mars"
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

    post1Str = '{"_id":"' + post1ID.toHexString() + '","userID":"' + user1ID.toHexString() + '","description":"post by user1","gameName":"xyz","numPlayers":5,"gameTimeUTC":"' + date1.toISOString() + '","duration":"1hr","location":"Earth"}'

    //user2,token 2, post 2
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    token2.userID = user2ID;
    let token2Inserted = await tokens.insertOne(token2)

    post2.userID = user2ID;
    let post2Inserted = await posts.insertOne(post2);
    post2ID = post2Inserted.insertedId;
    post2Str = '{"_id":"' + post2ID.toHexString() + '","userID":"' + user2ID.toHexString() + '","description":"post by user2","gameName":"xyz","numPlayers":5,"gameTimeUTC":"' + date2.toISOString() + '","duration":"1hr","location":"Mars"}'


    post3.userID = user2ID;
    let post3Inserted = await posts.insertOne(post3);
    post3ID = post3Inserted.insertedId;
    post3Str = '{"_id":"' + post3ID.toHexString() + '","userID":"' + user2ID.toHexString() + '","description":"post by user2","gameName":"xyz","numPlayers":5,"gameTimeUTC":"' + date3.toISOString() + '","duration":"1hr","location":"Mars"}'


}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test search/filter posts', () => {
    test('Get posts between date1 and date2', (done) => {
        return request(app).get('/posts/getPostsBetweenDates')
        .query({startDateUTC: date1, endDateUTC: date2})
        .expect('['+post1Str+','+post2Str+']')
        .expect(200).end(done); 
    });

    test('Get posts after date1', (done) => {
        return request(app).get('/posts/getPostsBetweenDates')
        .query({startDateUTC: date1})
        .expect('['+post1Str+','+post2Str+','+post3Str+']')
        .expect(200).end(done); 
    });

    test('Get posts before date1', (done) => {
        return request(app).get('/posts/getPostsBetweenDates')
        .query({endDateUTC: date1})
        .expect('['+post1Str+']')
        .expect(200).end(done); 
    });

    test('Get posts with no date filters, return all valid posts', (done) => {
        return request(app).get('/posts/getPostsBetweenDates')
        .expect('['+post1Str+','+post2Str+','+post3Str+']')
        .expect(200).end(done); 
    });

});