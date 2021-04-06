'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, ratings;
let user1ID, user2ID;

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}


//logged in
let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 9999999999999}

beforeAll(async () => {
    if (!db) db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    tokens = db.collection("tokens");
    ratings = db.collection("ratings");

    //set up DB with mock data
    await seedDB();
});

async function seedDB() {

    //user1,token 1
    let user1Inserted = await users.insertOne(user1);
    user1ID = ObjectId(user1Inserted.insertedId);

    token1.userID = user1ID;
    let token1Inserted = await tokens.insertOne(token1)

    //user2,token 2
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

describe('Test Add Ratings', () => {
    test('User 2 can rate user1 profile', (done) => {
        return request(app).post('/ratings/addRatings')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token')
        .query({userID: user1ID.toHexString()})
        .send({
            strength: 5, 
            punctuality: 5, 
            friendliness: 4,
            fun: 4,
            playAgain: true,
            comment: "this is a comment"
        })
        .expect(201).end(done);
    });

    test('User 2 re-rates user1 profile', (done) => {
        return request(app).post('/ratings/addRatings')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token')
        .query({userID: user1ID.toHexString()})
        .send({
            strength: 5, 
            punctuality: 5, 
            friendliness: 4,
            fun: 4,
            playAgain: true,
            comment: "second rating"
        })
        .expect(201).end(done);
    });

    test('User1 cannot rate user1 profile', (done) => {
        return request(app).post('/ratings/addRatings')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token')
        .query({userID: user1ID.toHexString()})
        .send({
            strength: 5, 
            punctuality: 5, 
            friendliness: 4,
            fun: 4,
            playAgain: true,
            comment: "this is a comment"
        })
        .expect(401).end(done);
    });

    test('Can\'t rate profile without logging in', (done) => {
        return request(app).post('/ratings/addRatings')
        .set('Cookie', '')//clear cookie and reset
        .query({userID: user1ID.toHexString()})
        .send({
            strength: 5, 
            punctuality: 5, 
            friendliness: 4,
            fun: 4,
            playAgain: true,
            comment: "this is a comment"
        })
        .expect(401).end(done);
    });
    
    test('Rating must contain userID, strength, punctuality, friendliness, fun, playAgain', (done) => {
        return request(app).post('/ratings/addRatings')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token')
        .send({

        })
        .expect(400).end(done);
    });
});