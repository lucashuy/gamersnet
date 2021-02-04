'use strict';

describe('Test true', () => {
    test('true === true', () => {
        expect(true).toBe(true);
    });

    test('1 === 1', () => {
        expect(1).toBe(1);
    });

    test('\'apple\' !== \'banana\'', () => {
        expect('apple').not.toBe('banana');
    });
});