'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
let users, tokens, posts;

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

}

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    await MongoDB.close();
})


describe('Test Post Updates', () => {
    test('Get list of all posts from empty db', (done) => {
        return request(app).post('/posts/listAllPosts')
        .expect(404).end(done); //no post found
    });

    test('Get list of all VALID posts from empty db', (done) => {
        return request(app).post('/posts/listAllValidPosts')
        .expect(404).end(done); //no post found
    });

    test('Get list of all VALID posts from empty db', (done) => {
        return request(app).post('/posts/getPostbyID')
        .expect(404).end(done); //no post found
    });
    
});