'use strict';

let ObjectID = require('mongodb').ObjectId;
let request = require('supertest');

let app = require('../../app');
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
        return request(app).get('/users/updatePassword').expect(404).end(done);
    });
    
    test('Missing token cookie', (done) => {
        return request(app).patch('/users/updatePassword').send({
            oldPassword: '123',
            newPassword: '123'
        }).expect(400).end(done);
    });

    test('Missing token cookie and body', (done) => {
        return request(app).patch('/users/updatePassword').expect(400).end(done);
    });
});

describe('Test password change (single user)', () => {
    // password 9999
    let hashedPassword = '$2b$10$intP40iXYmNia/XUWjq4Pu/aamccICNOwhOXVsPXmFacpH1/acofG';

    beforeEach(async () => {
        let result = await db.collection('users').insertOne({username: 'bob', password: hashedPassword});
        let id = await result.insertedId;

        await db.collection('tokens').insertOne({
            userID: ObjectID(await id),
            token: 'abc',
            expires: 99999999999999
        });
    });

    test('Missing body, but valid token', (done) => {
        return request(app).patch('/users/updatePassword')
        .set('Cookie', 'token=abc')
        .expect(400).end(done);
    });

    test('Invalid old password', (done) => {
        return request(app).patch('/users/updatePassword')
        .set('Cookie', 'token=abc')
        .send({
            oldPassword: '8888',
            newPassword: '9999'
        })
        .expect(401).end(done);
    });
    
    test('Test valid password change', (done) => {
        return request(app).patch('/users/updatePassword')
        .set('Cookie', 'token=abc')
        .send({
            oldPassword: '9999',
            newPassword: '9999'
        })
        .expect(204).end(async () => {
            let result = await db.collection('users').find({username: 'bob'});
            
            expect(await result.password).not.toBe(hashedPassword);
    
            done();
        });
    });
});