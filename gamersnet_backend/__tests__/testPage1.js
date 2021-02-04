'use strict';

// include our express object and API testing framework
let app = require('../app');
let request = require('supertest');

describe('Test GET /page1', () => {
    test('Request should have 200 status', () => {
        return request(app).get('/page1').expect(200);
    });
    
    test('Response should contain key \'1\' with value \'lol\'', () => {
        return request(app).get('/page1').then((response) => {
            let json = JSON.parse(response.text);
            
            expect(json).toHaveProperty('1', 'lol');
        });
    });
    
    test('Response should contain key \'str1\' with value \'this is page1\'', () => {
        return request(app).get('/page1').then((response) => {
            let json = JSON.parse(response.text);
            
            expect(json).toHaveProperty('str1', 'this is page1');
        });
    });
});