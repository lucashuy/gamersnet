'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, messages;
let user1ID, user2ID;

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

//logged in
let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}

beforeAll(async () => {
    if (!db) db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    tokens = db.collection("tokens");
    messages = db.collection('messages');

    //set up DB with mock data
    await seedDB();
});

async function seedDB() {

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
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test adding Messages', () => {
    test('User 1 logged in and can send messages', (done) => {
        return request(app).post('/messages/addMessage')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token')
        .send({
            receiver : user2ID,
            timestamp : Date.now(),
            message : "HELLO! " 
        })
        .expect(201).end(done);
    });


    test('User 2 not logged in and should not be allowed to send messages', (done) => {
        return request(app).post('/messages/addMessage')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token')//logged in as user 2 but expired session
        .send({
            receiver : user1ID,
            timestamp : Date.now(),
            message : "HELLO! "
        })
        .expect(401).end(done);
    });


    test('User 1 logged in, but does not pass appropriate message', (done) => {
        return request(app).post('/messages/addMessage')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token') //was logged as user1
        .send({
            receiver : user2ID,
            timestamp : Date.now(),
            message : null
        })
        .expect(400).end(done);
    });

    test('User 1 logged in, but cannot send messages to themselves', (done) => {
        return request(app).post('/messages/addMessage')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token') //was logged as user1
        .send({
            receiver : user1ID,
            timestamp : Date.now(),
            message : "HELLO! "
        })
        .expect(400).end(done);
    });
    
});