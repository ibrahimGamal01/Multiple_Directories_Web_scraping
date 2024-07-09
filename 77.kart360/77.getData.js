const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = '77.Data.json';
const INPUT_FILE = 'links.txt';
const TIMEOUT = 60000; // 60 seconds timeout for page loading

// Function to scrape details from a single page
async function scrapeDetails(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

        console.log('Waiting for selectors...');
        await page.waitForSelector('.u-text-xl', { timeout: TIMEOUT });
        await page.waitForSelector('.o-List-item', { timeout: TIMEOUT });

        const details = await page.evaluate(() => {
            const name = document.querySelector('.u-text-xl a') ? document.querySelector('.u-text-xl a').innerText.trim() : null;
            let phone = document.querySelector('a[href^="tel:"]') ? document.querySelector('a[href^="tel:"]').innerText.trim() : null;
            let address = document.querySelectorAll('.o-List-item .o-media__body')[1] ? document.querySelectorAll('.o-List-item .o-media__body')[1].innerText.trim() : null;
            const imgURL = document.querySelector('.u-mr-4 a img') ? document.querySelector('.u-mr-4 a img').src : null;
            const website = document.querySelector('.o-List-item .o-media__body a.u-colorBase') ? document.querySelector('.o-List-item .o-media__body a.u-colorBase').href : null;

            // If phone is null, use the first element (address)
            if (phone == null) {
                address = document.querySelectorAll('.o-List-item .o-media__body')[0] ? document.querySelectorAll('.o-List-item .o-media__body')[0].innerText.trim() : null;
            }

            return { name, phone, address, imgURL, website };
        });

        return details;

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return {}; // Return an empty object on error
    } finally {
        await browser.close();
    }
}

// Function to read URLs from a file and process each one
async function processLinks(file) {
    const filePath = path.join(__dirname, file);
    const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
    const results = [];

    for (const url of urls) {
        console.log(`Processing ${url}...`);
        const data = await scrapeDetails(url);
        if (Object.keys(data).length) { // Only add non-empty data
            results.push(data);
        }
    }

    // Writing results to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Data has been written to ${OUTPUT_FILE}`);
}

// Adjust the path to your links.txt file
processLinks(INPUT_FILE).catch(error => {
    console.error('Error during processing:', error);
});