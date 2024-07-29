const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeKartingData() {
    const url = 'https://pakarting.com/?sort=city';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => {
        const tracks = document.querySelectorAll('.tracksOuter .track');
        const result = [];

        tracks.forEach(track => {
            const nameElement = track.querySelector('.name a');
            const locationElement = track.querySelector('.location');
            const mapElement = locationElement.querySelector('.map');

            const name = nameElement ? nameElement.textContent.replace(/\s+/g, ' ').trim() : null;
            const link = nameElement ? nameElement.href : null;
            const location = locationElement ? locationElement.textContent.replace(/\s+/g, ' ').trim() : null;
            const mapLink = mapElement ? mapElement.href : null;

            result.push({ name, link, location, mapLink });
        });

        return result;
    });

    await browser.close();

    fs.writeFileSync('75.Data.json', JSON.stringify(data, null, 2));
    console.log('Data saved to 75.Data.json');
}

scrapeKartingData().catch(console.error);
