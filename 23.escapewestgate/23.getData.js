const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const data = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('tbody tr:not(:first-child)'));
            const escapeRooms = [];

            tableRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const country = cells[0]?.innerText || null;
                const state = cells[1]?.innerText || null;
                const city = cells[2]?.innerText || null;
                const organization = cells[3]?.innerText || null;
                const room = cells[4]?.innerText || null;
                const url = cells[5]?.querySelector('a')?.href || null;

                if (country && state && city && organization && room && url) {
                    escapeRooms.push({ country, state, city, organization, room, url });
                }
            });

            return escapeRooms;
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
        console.log('Scraping data from https://escapewestgate.com/escape-room-directory-best-escape-room-games-near-me/');
        const url = 'https://escapewestgate.com/escape-room-directory-best-escape-room-games-near-me/';
        const result = await scrapeData(url);

        if (!result.error) {
            fs.writeFileSync('escape_rooms.json', JSON.stringify(result.data, null, 2));
            console.log('Scraped data saved to escape_rooms.json');
        } else {
            console.error('Error scraping data:', result.error);
        }
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAll();
