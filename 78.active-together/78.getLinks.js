const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeLinks(pageUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const links = await page.evaluate(() => {
            const linkElements = Array.from(document.querySelectorAll('.items .heading a'));
            return linkElements.map(link => link.href);
        });

        await browser.close();
        return links;
    } catch (error) {
        console.error(`Error scraping links from ${pageUrl}: ${error}`);
        await browser.close();
        return [];
    }
}

async function scrapeAllLinks() {
    try {
        const basePageUrl = 'https://www.active-together.org/directory?page=';
        const totalPages = 55; // Adjust this based on the actual number of pages

        let allLinks = [];
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const pageUrl = `${basePageUrl}${pageNum}`;
            console.log(`Scraping links from page ${pageNum}`);
            const links = await scrapeLinks(pageUrl);
            allLinks = allLinks.concat(links);
        }

        fs.writeFileSync('links.txt', allLinks.join('\n'));
        console.log('Links saved to links.txt');
    } catch (error) {
        console.error('Error scraping links:', error);
    }
}

// Usage
scrapeAllLinks();
