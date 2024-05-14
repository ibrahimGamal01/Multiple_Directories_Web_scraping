const puppeteer = require('puppeteer');
const fs = require('fs');

const PAGE_COUNT = 30; // Increase the page count as needed
const OUTPUT_FILE = 'links.txt';

async function scrapeKartCenterLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const links = [];
        for (let i = 1; i <= PAGE_COUNT; i++) {
            console.log(`Navigating to page ${i}...`);
            await page.goto(`${url}?page=${i}`);

            const pageLinks = await page.evaluate(() => {
                const links = [];
                const linkElements = document.querySelectorAll('a.btn.btn--2.btn-primary[href^="/en/tracks/"]');
                linkElements.forEach(link => {
                    links.push(link.href);
                });
                return links;
            });

            links.push(...pageLinks);
        }

        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        return null;
    } finally {
        await page.close();
        await browser.close();
    }
}

async function saveLinksToFile(links, outputFile) {
    try {
        fs.writeFileSync(outputFile, links.join('\n'));
        console.log(`Links saved to ${outputFile}`);
    } catch (error) {
        console.error('Error saving links to file:', error);
    }
}

async function runScraping() {
    const url = 'https://www.kart-center.com/en/tracks/';
    const links = await scrapeKartCenterLinks(url);
    if (links) {
        saveLinksToFile(links, OUTPUT_FILE);
    } else {
        console.log('No links scraped.');
    }
}

runScraping().catch(error => console.error('Scraping failed:', error));
