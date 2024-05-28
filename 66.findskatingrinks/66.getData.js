const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeIceRinks(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const data = [];

        for (let i = 2; i <= 289; i++) {
            await page.goto(`${url}/page/${i}`, { waitUntil: 'domcontentloaded', timeout: 90000 });

            const pageData = await page.evaluate(() => {
                const articles = document.querySelectorAll('article.w2dc-listing');

                const results = [];

                articles.forEach(article => {
                    const name = article.querySelector('h2 a').innerText.trim();
                    const addressElement = article.querySelector('.w2dc-field-addresses');
                    const address = addressElement ? addressElement.innerText.trim() : '';
                    const websiteElement = article.querySelector('.w2dc-field-output-block-website a');
                    const website = websiteElement ? websiteElement.href : '';

                    results.push({
                        Name: name,
                        Address: address,
                        Website: website
                    });
                });

                return results;
            });

            data.push(...pageData);
            console.log(`Scraped data from page ${i}`);
        }

        return data;

    } catch (error) {
        console.error('Error scraping ice rinks:', error);
        return [];
    } finally {
        await browser.close();
    }
}

const url = 'https://findskatingrinks.com/ice-rinks';
scrapeIceRinks(url).then(data => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync('66.Data.json', jsonData);
    console.log('Data saved to IceRinks.json');
}).catch(error => {
    console.error('Error:', error);
});


