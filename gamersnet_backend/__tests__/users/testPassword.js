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

describe('Test password change (empty database)', () => {
    test('Invalid method', (done) => {
        return request(app).get('/users/updatePassword').send({
            password: '123'
        }).expect(404).end(done);
    });
    
    test('Missing token cookie', (done) => {
        return request(app).patch('/users/updatePassword').send({
            password: '123'
        }).expect(400).end(done);
    });

    test('Missing token cookie and body', (done) => {
        return request(app).patch('/users/updatePassword').expect(400).end(done);
    });
});