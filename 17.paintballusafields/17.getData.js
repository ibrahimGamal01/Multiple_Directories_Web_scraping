const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const data = await page.evaluate(() => {
            const parkEntries = Array.from(document.querySelectorAll('.park-entry'));

            const parks = parkEntries.map(entry => {
                const name = entry.querySelector('.park-name')?.innerText || null;
                const location = entry.querySelector('.park-location')?.innerText || null;
                const phone = entry.innerText.match(/\d{3}-\d{3}-\d{4}/g) ? entry.innerText.match(/\d{3}-\d{3}-\d{4}/g)[0] : null;
                const websiteElement = entry.querySelector('a[href*="www."]');
                const website = websiteElement ? websiteElement.href : null;
                const details = entry.innerText.replace(/\s+/g, ' ').trim();

                // Check if Facebook link exists
                const facebookLink = entry.innerText.match(/facebook\.com\/[a-zA-Z0-9-]+/g);
                const facebook = facebookLink ? `https://${facebookLink[0]}` : null;

                return { name, location, phone, website, facebook, details };
            });

            return parks;
        });

        await browser.close();
        return { url, data };
    } catch (error) {
        console.error(`Error scraping ${url}: ${error}`);
        await browser.close();
        return { url, error: error.message };
    }
}

async function scrapeAll() {
    try {
        console.log('Scraping data from https://www.paintballusafields.com/parks/');
        const url = 'https://www.paintballusafields.com/parks/';
        const result = await scrapeData(url);

        if (!result.error) {
            fs.writeFileSync('17.Data.json', JSON.stringify(result.data, null, 2));
            console.log('Scraped data saved to 17.Data.json');
        } else {
            console.error('Error scraping data:', result.error);
        }
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAll();
