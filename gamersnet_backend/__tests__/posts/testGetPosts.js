'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, posts;
let user1ID, user2ID;
let post1ID, post2ID;

let currDate = new Date();
let futureDate = new Date();
let pastDate = new Date();
futureDate.setDate(currDate.getDate() + 1);
pastDate.setDate(currDate.getDate() - 1);

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}//logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}//not logged in

//the scheduled time of this game is still due
let post1 = {
    userID : ObjectID(),
    description: "post by user1",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: futureDate,
    duration: "1hr",
    location: "Earth"
}

//the scheduled time of this game is already past
let post2 = {
    userID : ObjectID(),
    description: "post by user2",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: pastDate,
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

    //user2,token 2, post 2
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    token2.userID = user2ID;
    let token2Inserted = await tokens.insertOne(token2)

    post2.userID = user2ID;
    let post2Inserted = await posts.insertOne(post2);
    post2ID = post2Inserted.insertedId;

    //let result = await posts.findOne({ gameTimeUTC: {$gte: futureDate}});//works
    //let result = await posts.find({});//but this return Promise {<Pending>}
    //   console.log(result)
}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test get posts from db', () => {
    test('Get list of all posts in db', (done) => {
        return request(app).get('/posts/listAllPosts')
        .expect(200).end(done); 
    });

    test('Get list of all valid posts in db, response only contains future dated posts.', (done) => {
        return request(app).get('/posts/listValidPosts')
        .expect(200)
        .expect('[{"_id":"' +post1ID.toHexString()+'","userID":"'+user1ID.toHexString()+'","description":"post by user1","gameName":"xyz","numPlayers":5,"gameTimeUTC":"'+futureDate.toISOString()+'","duration":"1hr","location":"Earth"}]')
        .end(done); 
    });

    test('Get the post with the given postID', (done) => {
        return request(app).get('/posts/getPostbyID')
        .query({_id: post1ID.toHexString()})
        .expect(200)
        .end(done); 
    });

});