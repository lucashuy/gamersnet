'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, posts;
let user1ID, user2ID;

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}//logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}//not logged in

beforeAll(async () => {
    if (db) await MongoDB.close();
    db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    tokens = db.collection("tokens");
    posts = db.collection("posts");

    //set up DB with mock data
    await seedDB();
});

async function seedDB() {

    //insert users
    await users.deleteMany();
    await tokens.deleteMany();
    await posts.deleteMany();

    //user1,token 1, post 1
    let user1Inserted = await users.insertOne(user1);
    user1ID = ObjectId(user1Inserted.insertedId);

    token1.userID = user1ID;
    let token1Inserted = await tokens.insertOne(token1)

    //user2,token 2, post 2
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    token2.userID = user2ID;
    let token2Inserted = await tokens.insertOne(token2)
}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    await MongoDB.close();
})



describe('Test Create Posts', () => {
    test('User 1 logged in and can create post=> 201 created post', (done) => {
        return request(app).post('/posts/createPost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token')
        .send({
            description: "post by user1 (CREATED)",
            gameName: "xyz",
            numPlayers: 5, 
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "someplace"
        })
        .expect(201).end(done);
    });


    test('User 2 not logged in and can\'t create post => 401 unauthorized', (done) => {
        return request(app).post('/posts/createPost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token')//logged in as user 2 but expired session
        .send({
            description: "post by user2, (SHOULD NOT BE CREATED)",
            gameName: "xyz",
            numPlayers: 5, 
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "someplace"
        })
        .expect(401).end(done);
    });


    test('User 1 logged in, but didn\'t post necessary info to create post=>400 bad request', (done) => {
        return request(app).post('/posts/createPost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token') //was logged as user1
        .send({
            description: null,
            gameName: "xyz",
            numPlayers: 5,
            gameTimeUTC: "", 
            duration: "1hr",
            location: "someplace"
        })
        .expect(400).end(done);
    });

    test('User 1 logged in, but didn\'t post optional info to create post=>201 create post', (done) => {
        return request(app).post('/posts/createPost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token') //was logged as user1
        .send({
            description: "another post by user1 (CREATED)",
            gameName: "xyz",
            numPlayers: 5, 
            gameTimeUTC: "2020-01-01T10:10:10Z", 
            duration: "",//optional
            location: null
        })
        .expect(201).end(done);
    });
    
});