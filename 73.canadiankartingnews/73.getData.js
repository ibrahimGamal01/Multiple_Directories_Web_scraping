const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function scrapeTrackData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 9000000 });

    const data = await page.evaluate(() => {
        const results = [];
        const articles = document.querySelectorAll('article.ckn-directory-listing');

        articles.forEach(article => {
            const nameElement = article.querySelector('.listing-title a');
            const addressElement = article.querySelector('.listing-addy');
            const imageElement = article.querySelector('.listing-tile img');
            const emailElement = article.querySelector('.d-icon.email');
            const phoneElement = article.querySelector('table tr:nth-child(1) td');
            const websiteElement = article.querySelector('table tr:nth-child(2) a');
            const lengthElement = article.querySelector('table tr:nth-child(3) td');
            const onsiteShopElement = article.querySelector('table tr:nth-child(4) td');

            // Handle missing data
            if (!nameElement || !addressElement || !imageElement || !emailElement ||
                !phoneElement || !websiteElement || !lengthElement || !onsiteShopElement) {
                console.error('Missing data in article:', article);
                return; // Skip this article if essential data is missing
            }

            const name = nameElement.innerText.trim();
            const address = addressElement.innerText.trim();
            const imageLink = imageElement.src;
            const email = emailElement.href.split(':')[1];
            const phone = phoneElement.innerText.trim();
            const website = websiteElement.href;
            const length = lengthElement.innerText.trim();
            const onsiteShop = onsiteShopElement.innerText.trim();

            results.push({
                name,
                address,
                phone,
                website,
                email,
                imageLink,
                onsiteShop,
                length,
            });
        });

        return results;
    });

    await browser.close();
    return data;
}

const trackUrl = 'https://www.canadiankartingnews.com/ckn-track-directory/';
scrapeTrackData(trackUrl)
    .then(data => {
        const jsonData = JSON.stringify(data, null, 2);
        return fs.writeFile('track_data.json', jsonData);
    })
    .then(() => console.log('Data written to track_data.json'))
    .catch(error => console.error('Scrape and write failed:', error));
