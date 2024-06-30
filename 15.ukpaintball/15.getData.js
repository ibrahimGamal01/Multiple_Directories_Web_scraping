const puppeteer = require('puppeteer');
const fs = require('fs');

// Read links from 15.links.txt
const links = fs.readFileSync('15.links.txt', 'utf-8').split('\n').filter(link => link.trim());

// Scrape data from each link
const scrapeData = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const name = document.querySelector('.region-highlighted h1')?.innerText.trim();
            const details = document.querySelector('.region-highlighted h3')?.innerText.trim();
            const address = document.querySelector('.details')?.innerText.trim();

            return { name, address, details };
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
};

// Main function to scrape all links
(async () => {
    const results = [];
    for (const link of links) {
        console.log(`Scraping ${link}...`);
        const data = await scrapeData(link);
        if (data) {
            results.push(data);
        }
    }

    // Save results to a JSON file
    fs.writeFileSync('15.Data.json', JSON.stringify(results, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to scraped_data.json');
        }
    });
})();
