'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, posts;
let user1ID, user2ID, user3ID;
let post1ID, post2ID, post3ID;

let user1 = {
    username: "user1",
    password: "123"
}

let user2 = {
    username: "user2",
    password: "456"
}

let user3 = {
    username: "user3",
    password: "789"
}


let token1 = {
    token: "user1_token",
    userID: ObjectID(),
    expires: 9999999999999 //logged in
}
let token2 = {
    token: "user2_token",
    userID: ObjectID(),
    expires: 9999999999999 //logged in
}
let token3 ={
    token: "user3_token",
    userID: ObjectID(),
    expires: 0 //expired or not logged in
}

let post1 = {
    userID : ObjectID(),
    description: "post by user1",
    gameName: "xyz",
    numPlayers: 5,
    gameTimeUTC: new Date(),
    duration: "1hr",
    location: "Earth"
  }

beforeAll(async () => {
    if (db) await MongoDB.close();
    db = await MongoDB.open();

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
    // let userInserted = await users.insertMany([user1, user2, user3]);

    // console.log(userInserted);
    // console.log(userInserted.insertedIds["0"]);

    let userInserted = await users.insertOne(user1);
    user1ID = ObjectId(userInserted.insertedId);
    //console.log(userInserted.ops);

    token1.userID = user1ID;
    let tokenInserted = await tokens.insertOne(token1)
    //console.log(tokenInserted.ops);

    post1.userID = user1ID;
    let postInserted = await posts.insertOne(post1);
    //console.log(postInserted.ops)
    post1ID = postInserted.insertedId;

    //let x = await users.findOne({username: 'user1'});

    //console.log(post1ID.toHexString());------>

    //console.log(post1ID);------->looks same as hex string in console
    //insert tokens
    // let user1ID  = user1Doc.toArray();
    // console.log(user1ID);
}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit

    //console.log("closing");
    await MongoDB.close();
    //console.log("closed");
})



describe('Test Post Updates', () => {
    test('User 1 is logged in and can update post of user 1', (done) => {
        return request(app).post('/posts/updatePost')
        .set('Cookie', 'token=user1_token')
        .query({_id: post1ID.toHexString()})
        .send({
            _id: post1ID,
            userID: user1ID,// intended to link to existing users in db
            description: "post by user1, (UPDATE)",
            gameName: "xyz",
            numPlayers: 5, //null in case of incorrect format
            gameTimeUTC: new Date(), 
            duration: "1hr",
            location: "Earth"
        })
        .expect(201).end(done);
    });
    
});