'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;

beforeEach(async () => {
    if (!db) db = await MongoDB.open();
});

afterEach(async () => {
    if (db) {
        await MongoDB.close();
        db = null;
    }
})

describe('Test Authenticate Account (function testing)', () => {
    test('Blank password and username', (done) => {
        return request(app).post('/users/authenticate').send({
            username: '',
            password: ''
        }).expect(400).end(done);
    });

    test('No body', (done) => {
        return request(app).post('/users/authenticate').expect(400).end(done);
    });

    test('Incorrect method', (done) => {
        return request(app).get('/users/authenticate').expect(404).end(done);
    });

    test('Valid username, invalid password', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'usrnme',
            password: ''
        }).expect(400).end(done);
    });

    test('Invalid username, valid password', (done) => {
        return request(app).post('/users/authenticate').send({
            username: '',
            password: 'pwd'
        }).expect(400).end(done);
    });
});

describe('Test Authenticate Account (single user + token document)', () => {
    beforeEach(async () => {
        // username bob, password 9999
        db.collection('users').insertOne({username: 'bob', password: '$2b$10$intP40iXYmNia/XUWjq4Pu/aamccICNOwhOXVsPXmFacpH1/acofG'});
    });

    test('Authenticate with correct details', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'bob',
            password: '9999'
        }).expect(200).end(done);
    });

    test('Authenticate with correct details (token)', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'bob',
            password: '9999'
        }).expect(200).end((error, response) => {
            if (error) return done(error);
            
            expect(response.header['set-cookie']).toBeDefined();

            done();
        });
    });

    test('Authenticate with correct details (user ID)', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'bob',
            password: '9999'
        }).expect(200).end((error, response) => {
            if (error) return done(error);
            
            expect(response.text).toBeDefined();

            let json = JSON.parse(response.text);
            
            expect(json).toBeDefined();
            expect(json['user_id']).toBeDefined();

            done();
        });
    });

    test('Authenticate with incorrect password', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'bob',
            password: 'abc'
        }).expect(401).end(done);
    });

    test('Authenticate with non exist username', (done) => {
        return request(app).post('/users/authenticate').send({
            username: 'not bob',
            password: 'abc'
        }).expect(401).end(done);
    });
});