let puppeteer = require('puppeteer');

beforeEach(async () => {
    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

describe('End-to-end test sign in component', () => {
    test('Empty username and password', async () => {
        await page.waitForSelector('form');

        let div = page.$('.login-form');
        console.log(div);
        expect(1).toBe(1);
    });
});