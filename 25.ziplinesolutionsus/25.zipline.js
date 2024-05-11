const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractLocations(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.card'));
        return cards.map(card => {
            const imageUrl = card.querySelector('figure.card-img img')?.src;
            const name = card.querySelector('.card-block a')?.textContent;
            const website = card.querySelector('.card-block a')?.href;
            const descriptions = Array.from(card.querySelectorAll('.card-block p')).map(p => p.textContent.trim()).filter(text => text);

            let phone = null;
            let address = null;
            let description1 = null;
            let description2 = null;

            descriptions.forEach(desc => {
                if (desc.startsWith('Phone #:')) {
                    phone = desc.replace('Phone #:', '').trim();
                } else if (/^[a-zA-Z]+, [a-zA-Z]+$/.test(desc)) {
                    address = desc;
                } else {
                    if (!description1) {
                        description1 = desc;
                    } else if (!description2) {
                        description2 = desc;
                    }
                }
            });

            return { name, website, imageUrl, address, phone, description1, description2 };
        });
    });

    await browser.close();

    // Writing data to JSON file
    fs.writeFile('locations.json', JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log('Data has been written to JSON file successfully.');
    });

    return data;
}

const url = 'https://www.ziplinesolutionsus.com/locations/';

extractLocations(url)
    .then(data => console.log('Data extracted successfully.'))
    .catch(error => console.error('Error:', error));
