const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeRoomData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const data = await page.evaluate(() => {
            const title = document.querySelector('.portfolio-header .h1')?.innerText.trim() || null;
            const ageLimit = document.querySelector('.portfolio-header .age-limit')?.innerText.trim() || null;
            const images = Array.from(document.querySelectorAll('.carousel-inner .item img')).map(img => img.src);
            const participants = document.querySelector('.room-icons .fa-users + span')?.innerText.trim() || null;
            const address = document.querySelector('.room-icons .fa-map-marker + a')?.innerText.trim() || null;
            const phone = document.querySelector('.room-icons .fa-phone-square + a strong')?.innerText.trim() || null;
            const categories = Array.from(document.querySelectorAll('.room-icons .fa-tags + a')).map(a => a.innerText.trim());

            return { title, ageLimit, images, participants, address, phone, categories };
        });

        console.log('Scraped Data:', data);
        return data;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

async function runScraping() {
    const linksFile = '19.links.txt';
    const outputFile = 'roomsData.json';

    const links = fs.readFileSync(linksFile, 'utf8').split('\n').filter(link => link);

    const results = [];

    for (const link of links) {
        const data = await scrapeRoomData(link);
        if (data) results.push(data);
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Scraping completed. Data saved to ${outputFile}`);
}

// Example usage
runScraping().catch(error => console.error('Error:', error));
