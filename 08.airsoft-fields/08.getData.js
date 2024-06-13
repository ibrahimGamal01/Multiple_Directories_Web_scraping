const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeAirsoftFields(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const airsoftFieldsData = await page.evaluate(url => {
        const fieldElements = document.querySelectorAll('#field-results .field-result');

        const fields = [];
        fieldElements.forEach(element => {
            const name = element.querySelector('h3').textContent.trim();
            const detailsTable = element.querySelector('.details table');

            let postcode = null;
            detailsTable.querySelectorAll('tr').forEach(row => {
                const label = row.querySelector('td').textContent.trim();
                const value = row.querySelector('td:last-child').textContent.trim();
                if (label === 'Postcode:') {
                    postcode = value;
                }
            });

            const website = element.querySelector('td[colspan="2"] a').href;
            const city = url.split('/').pop(); // Extract city from URL
            fields.push({ name, postcode, city, website });
        });

        return fields;
    }, url);

    await browser.close();

    return airsoftFieldsData;
}

async function scrapeAllLinks(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        let allFieldsData = [];

        for (const url of urls) {
            console.log(`Scraping data from ${url}`);
            const data = await scrapeAirsoftFields(url);
            allFieldsData = allFieldsData.concat(data);
        }

        fs.writeFileSync('08.Data.json', JSON.stringify(allFieldsData, null, 2));
        console.log('Data saved to 08.Data.json');
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputFile = '08.links.txt';
scrapeAllLinks(inputFile);
