'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, tokens, messages;
let user1ID, user2ID, user3ID, user4ID;

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}
let user3 = {username: "user3", password: "123"}
let user4 = {username: "user4", password: "456"}


let message1 = {
    sender : ObjectID(),
    receiver : ObjectID(),
    timestamp : Date.now(),
    message : "HELLO!" 
};

let message2 = {
    sender : ObjectID(),
    receiver : ObjectID(),
    timestamp : Date.now(),
    message : "Hola! " 
}

let message3 = {
    sender : ObjectID(),
    receiver : ObjectID(),
    timestamp : Date.now(),
    message : "Hi!" 
};

let message4 = {
    sender : ObjectID(),
    receiver : ObjectID(),
    timestamp : Date.now(),
    message : "What's up?" 
}

let message5 = {
    sender : ObjectID(),
    receiver : ObjectID(),
    timestamp : Date.now(),
    message : "When's the game?" 
}

//logged in
let token1 = {token: "user1_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token2 = {token: "user2_token", userID: ObjectID(), expires: 0}
//logged in
let token3 = {token: "user3_token", userID: ObjectID(), expires: 9999999999999}
//not logged in
let token4 = {token: "user4_token", userID: ObjectID(), expires: 0}

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

    //user1,token 1, message 1 ,sent 1 to user2, received 2 from user4, interactions-> user2, user4
    let user1Inserted = await users.insertOne(user1);
    user1ID = ObjectId(user1Inserted.insertedId);

    token1.userID = user1ID;
    await tokens.insertOne(token1)

    //user2,token 2, message 2(received one message from user1, one from user4, sent no one. interactions-> user1, user4)
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    token2.userID = user2ID;
    await tokens.insertOne(token2);

    //user3,token 3(no messages sent/received by this user, so no interactions)
    let user3Inserted = await users.insertOne(user3);
    user3ID = ObjectId(user3Inserted.insertedId);

    token3.userID = user3ID;
    await tokens.insertOne(token3);

    //user4,token 4, message 3,4, 5 (two messages sent to user 1,one to user 2 by this user,received from none), interactions -> user1, user2
    let user4Inserted = await users.insertOne(user4);
    user4ID = ObjectId(user4Inserted.insertedId);

    token4.userID = user4ID;
    await tokens.insertOne(token4);

    message1.sender = user1ID;
    message1.receiver = user2ID;
    await messages.insertOne(message1);
    
    message3.sender = user4ID;
    message3.receiver = user1ID;
    await messages.insertOne(message3);

    message4.sender = user4ID;
    message4.receiver = user1ID;
    await messages.insertOne(message4);

    message5.sender = user4ID;
    message5.receiver = user2ID;
    await messages.insertOne(message5);

}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test Getting interacted users', () => {
    test('User1 interactions-> user2, user4', (done) => {
        return request(app).get('/messages/listInteractedIDs')
        .set('Cookie', '')//clear cookie and reset
        .set('Cookie', 'token=user1_token')
        .query({ userID : user1ID.toHexString() })
        .expect('{"interactedIDs":["'+user2ID.toHexString()+'","'+user4ID.toHexString()+'"]}')
        .expect(200).end(done);
    });
    
});