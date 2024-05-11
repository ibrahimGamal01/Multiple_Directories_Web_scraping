const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('.i a');
        return Array.from(linkElements).map(link => link.href);
    });

    await browser.close();

    return links;
}

const url = 'https://www.indoorclimbing.com/worldgyms.html';

extractLinks(url)
    .then(links => {
        fs.writeFileSync('gym_links.txt', links.join('\n'));
        console.log('Links saved to gym_links.txt');
    })
    .catch(error => console.error('Error:', error));
