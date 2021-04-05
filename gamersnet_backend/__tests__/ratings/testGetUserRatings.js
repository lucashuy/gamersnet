'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
const { ObjectID, ObjectId } = require('bson');

let users, ratings;
let user1ID, user2ID, user3ID;
let rating1ID, rating2ID, rating1Str, rating2Str;
let user1AvgRating;

let currDate = new Date();

let user1 = {username: "user1", password: "123"}
let user2 = {username: "user2", password: "456"}
let user3 = {username: "user3", password: "456"}

//the scheduled time of this game is still due
let rating1 = {
    userID: ObjectID(),// intended to link to existing users in db
    raterID: ObjectID(),
    strength: 5,
    punctuality: 4, 
    friendliness: 4, 
    fun: 4,
    playAgain: true,
    rateDate: currDate, //date of rating/ creation date = current date
    comment: "One of the strongest players I played with!"
  }

//the scheduled time of this game is already past
let rating2 = {
    userID: ObjectID(),// intended to link to existing users in db
    raterID: ObjectID(),
    strength: 4,
    punctuality: 4, 
    friendliness: 4, 
    fun: 5,
    playAgain: true,
    rateDate: currDate, //date of rating/ creation date = current date
    comment: "Fun to play with, would definitely wanna play again :)"
}

beforeAll(async () => {
    if (!db) db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    ratings = db.collection("ratings");

    //set up DB with mock data
    await seedDB();
});

async function seedDB() {

    //user1,token 1, rating 1
    let user1Inserted = await users.insertOne(user1);
    user1ID = ObjectId(user1Inserted.insertedId);

    //user2,token 2, rating 2
    let user2Inserted = await users.insertOne(user2);
    user2ID = ObjectId(user2Inserted.insertedId);

    //user2,token 2, rating 2
    let user3Inserted = await users.insertOne(user3);
    user3ID = ObjectId(user3Inserted.insertedId);

    rating1.userID = user1ID;
    rating1.raterID = user2ID;
    let rating1Inserted = await ratings.insertOne(rating1);
    rating1ID = ObjectId(rating1Inserted.insertedId);
    rating1Str = '{"_id":"' + rating1ID.toHexString() + '","userID":"' + rating1.userID.toHexString() + '","raterID":"' + rating1.raterID.toHexString() 
                +'","strength":' + rating1.strength + ',"punctuality":' + rating1.punctuality + ',"friendliness":' + rating1.friendliness
                + ',"fun":' + rating1.fun + ',"playAgain":' + rating1.playAgain + ',"rateDate":"' + rating1.rateDate.toISOString() 
                + '","comment":"' + rating1.comment + '"}'

    rating2.userID = user1ID;
    rating2.raterID = user3ID;
    let rating2Inserted = await ratings.insertOne(rating2);
    rating2ID = ObjectId(rating2Inserted.insertedId);
    rating2Str = '{"_id":"' + rating2ID.toHexString() + '","userID":"' + rating2.userID.toHexString() + '","raterID":"' + rating2.raterID.toHexString() 
                +'","strength":' + rating2.strength + ',"punctuality":' + rating2.punctuality + ',"friendliness":' + rating2.friendliness
                + ',"fun":' + rating2.fun + ',"playAgain":' + rating2.playAgain + ',"rateDate":"' + rating2.rateDate.toISOString() 
                + '","comment":"' + rating2.comment + '"}'

    user1AvgRating = '{"userID":"'+user1ID.toHexString()+'","strength":4.5,"punctuality":4,"friendliness":4,"fun":4.5,"playAgain":100,"comments":[{"raterID":"'+user2ID.toHexString()+'","rateDate":"'+ rating1.rateDate.toISOString() +'","comment":"One of the strongest players I played with!"},{"raterID":"'+user3ID.toHexString()+'","rateDate":"'+ rating2.rateDate.toISOString() +'","comment":"Fun to play with, would definitely wanna play again :)"}]}'
}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test get ratings from db', () => {
    test('Get ratings for the userID', (done) => {
        return request(app).get('/ratings/getUserRatings')
        .query({userID: user1ID.toHexString()})
        .expect(200)
        .expect('['+ rating1Str + ',' +rating2Str +']')
        .end(done); 
    });

    test('Get Average ratings for the userID', (done) => {
        return request(app).get('/ratings/getUserAvgRatings')
        .query({userID: user1ID.toHexString()})
        .expect(200)
        .expect( user1AvgRating)
        .end(done); 
    });

});