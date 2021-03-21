'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, posts;
let user1ID, user2ID;
let post1ID, post2ID;

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}

let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}//logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}//logged in

let post1 = {
    userID : ObjectID(),
    description: "post by user1",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: new Date(),
    duration: "1hr",
    location: "Earth"
}
let post2 = {
    userID : ObjectID(),
    description: "post by user2",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: new Date(),
    duration: "1hr",
    location: "Pluto"
}

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

}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    await MongoDB.close();
})



describe('Test Post Updates', () => {
    test('User 1 is logged in and can update post of user 1', (done) => {
        return request(app).post('/posts/updatePost')
        .set('Cookie', 'token=user1_token')
        .query({_id: post1ID.toHexString()})
        .send({
            description: "post by user1, (UPDATE)",
            gameName: "xyz",
            numPlayers: 5, //null in case of incorrect format
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "Earth"
        })
        .expect(201).end(done);
    });


    test('User 1 is logged in and cannot update post of user 2', (done) => {
        return request(app).post('/posts/updatePost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token')//logged in as user 2
        .query({_id: post2ID.toHexString()}) //request to update post of user 1
        .send({
            description: "post by user2, (SHOULD NOT UPDATE)",
            gameName: "xyz",
            numPlayers: 5, //null in case of incorrect format
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "Pluto"
        })
        .expect(401).end(done);
    });


    test('User 2 login session expired and cannot update post of user 2', (done) => {
        return request(app).post('/posts/updatePost')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user2_token') //was logged as user2 but session expired
        .query({_id: post1ID.toHexString()})
        .send({
            _id: post1ID,
            userID: user1ID,// intended to link to existing users in db
            description: "post by user2, (SHOULD NOT UPDATE)",
            gameName: "xyz",
            numPlayers: 5, //null in case of incorrect format
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "Pluto"
        })
        .expect(401).end(done);
    });

    test('No user logged in, so can\'t update post', (done) => {
        return request(app).post('/posts/updatePost')
        .set('Cookie', '')//clear cookie and reset, no user logged in
        .query({_id: post1ID.toHexString()})
        .send({
            _id: post1ID,
            userID: user1ID,// intended to link to existing users in db
            description: "post by user2, (SHOULD NOT UPDATE)",
            gameName: "xyz",
            numPlayers: 5, //null in case of incorrect format
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "Pluto"
        })
        .expect(401).end(done);
    });
    
});