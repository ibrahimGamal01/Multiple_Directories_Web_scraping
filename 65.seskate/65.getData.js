const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeSkateRinks(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const data = await page.evaluate(() => {
            const rinkElements = document.querySelectorAll('p');

            const results = [];
            let currentState = '';
            let currentCity = '';
            let currentWebsite = '';

            rinkElements.forEach(element => {
                if (element.querySelector('span[style="color: #ff0000;"]')) {
                    currentState = element.innerText.trim();
                } else if (element.querySelector('a')) {
                    currentCity = element.innerText.trim().split(' – ')[0];
                    currentWebsite = element.querySelector('a').href;
                    results.push({
                        Name: element.innerText.trim().split(' – ')[1],
                        Website: currentWebsite,
                        State: currentState,
                        City: currentCity
                    });
                }
            });

            return results;
        });

        return data;

    } catch (error) {
        console.error('Error scraping skate rinks:', error);
        return [];
    } finally {
        await browser.close();
    }
}

const url = 'https://seskate.com/rinks/';
scrapeSkateRinks(url).then(data => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('65.Data.json', jsonData);
    console.log('Data saved to 65.Data.json');
}).catch(error => {
    console.error('Error:', error);
});
