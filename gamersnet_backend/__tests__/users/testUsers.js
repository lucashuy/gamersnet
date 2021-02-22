'use strict';

let app = require('../../app');
let request = require('supertest');

let MongoDB = require('../../persistence/mongodb');
let db;

beforeAll(async () => {
    if (db) await MongoDB.close();
    db = await MongoDB.open();
});

afterAll(async () => {
    // this is important to do, otherwise the db client remains open and tests never exit
    await MongoDB.close();
})

describe('Test true', () => {
    test('Request should have 200 status', () => {
        return request(app).get('/page1').expect(200);
    });
    
    test('Response should contain key \'1\' with value \'lol\'', () => {
        return request(app).get('/page1').then((response) => {
            let json = JSON.parse(response.text);
            
            expect(json).toHaveProperty('1', 'lol');
        });
    });
});