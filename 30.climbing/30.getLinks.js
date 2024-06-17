const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeClimbingGyms(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const links = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('.js-wpv-loop-wrapper .tb-grid-column a');
            const urls = Array.from(linkElements).map(anchor => anchor.href);
            return urls;
        });

        console.log('Scraped Links:', links);
        return links;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

async function runScraping() {
    const inputFilePath = '30.links.txt';
    const outputFilePath = 'extracted_links.txt';

    // Read the file containing the URLs
    const urls = fs.readFileSync(inputFilePath, 'utf-8').split('\n').filter(Boolean);
    
    let allLinks = [];
    for (const url of urls) {
        const links = await scrapeClimbingGyms(url);
        if (links) {
            allLinks = allLinks.concat(links);
        }
    }

    if (allLinks.length > 0) {
        fs.writeFileSync(outputFilePath, allLinks.join('\n'), 'utf8');
        console.log(`Scraping completed. Links saved to ${outputFilePath}`);
    } else {
        console.log('No links scraped.');
    }
}

runScraping().catch(error => console.error('Error:', error));