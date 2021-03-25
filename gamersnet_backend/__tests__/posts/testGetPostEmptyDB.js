'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;
let users, tokens, posts;

beforeAll(async () => {
    if (!db) db = await MongoDB.open();

    jest.setTimeout(10000);
    //create collections
    users = db.collection("users");
    tokens = db.collection("tokens");
    posts = db.collection("posts");

});

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    if (db) {
        await MongoDB.close();
        db = null;
    }
})


describe('Test get posts from empty db', () => {
    test('Get list of all posts from empty db', (done) => {
        return request(app).get('/posts/listAllPosts')
        .expect(404).end(done); //no post found
    });

    test('Get list of all VALID posts from empty db', (done) => {
        return request(app).get('/posts/listAllValidPosts')
        .expect(404).end(done); //no post found
    });

    test('Get list of all VALID posts from empty db', (done) => {
        return request(app).get('/posts/getPostbyID')
        .expect(404).end(done); //no post found
    });
    
});