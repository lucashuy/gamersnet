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

describe('Test Create User Account', () => {
    test('Blank password and username', (done) => {
        return request(app).post('/users/createAccount').send({
            username: '',
            password: ''
        }).expect(400).end(done);
    });

    test('No body', (done) => {
        return request(app).post('/users/createAccount').expect(400).end(done);
    });

    test('Incorrect method', (done) => {
        return request(app).get('/users/createAccount').expect(404).end(done);
    });

    test('Valid username, invalid password', (done) => {
        return request(app).post('/users/createAccount').send({
            username: 'usrnme',
            password: ''
        }).expect(400).end(done);
    });

    test('Invalid username, valid password', (done) => {
        return request(app).post('/users/createAccount').send({
            username: '',
            password: 'pwd'
        }).expect(400).end(done);
    });
    
    test('Valid account creation', (done) => {console.log('test');
        return request(app).post('/users/createAccount').send({
            username: 'usrnme',
            password: 'pwd'
        }).expect(200).end(done);
    });

    test('Valid token returned (non empty)', (done) => {
        return request(app).post('/users/createAccount').send({
            username: 'usrnme',
            password: 'pwd'
        }).expect(200).end((error, response) => {
            if (error) return done(error);
            
            expect(response.header['set-cookie']).toBeDefined();

            done();
        });
    });
});