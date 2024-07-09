const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Read and parse the JSON file
const jsonFilePath = path.join(__dirname, '06.links.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Function to scrape data from the website
async function scrapeData(link) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const getText = (selector) => document.querySelector(selector)?.innerText || 'N/A';
        const getAttr = (selector, attr) => document.querySelector(selector)?.getAttribute(attr) || 'N/A';
        const getListText = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText);

        return {
            address: getText('.thrv-styled-list-item:nth-child(1) a'),
            phone: getText('.thrv-styled-list-item:nth-child(2) a'),
            website: getAttr('.thrv-styled-list-item:nth-child(4) a', 'href'),
            hours: getText('.thrv-styled-list-item:nth-child(5)'),
            social_media: {
                facebook: getAttr('.tve_s_fb_share a', 'href'),
                instagram: getAttr('.tve_s_ig_share a', 'href'),
                twitter: getAttr('.tve_s_t_share a', 'href'),
            }
        };
    });

    await browser.close();
    return data;
}

// Function to process each item in the JSON data
async function processLinks(data) {
    for (const item of data) {
        if (!item.link) {
            console.log(`Skipping: ${item.name} (no link provided)`);
            continue;
        }
        console.log(`Processing: ${item.name}`);
        const additionalData = await scrapeData(item.link);
        Object.assign(item, additionalData);
    }
    return data;
}

// Main function to execute the process
async function main() {
    const enhancedData = await processLinks(jsonData);
    const outputFilePath = path.join(__dirname, '06.Data.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(enhancedData, null, 2), 'utf8');
    console.log(`Data has been written to ${outputFilePath}`);
}

main().catch(console.error);

