const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const { createObjectCsvWriter } = require('csv-writer');

async function scrapeTagActiveArena(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const productCards = Array.from(document.querySelectorAll('.uk-card-primary'));

            return productCards.map(card => {
                const titleElement = card.querySelector('h3.el-title a');
                const title = titleElement?.textContent.trim();
                const websiteUrl = titleElement?.href;
                const address = card.querySelector('.el-meta')?.textContent.trim();
                const visitWebsiteUrl = card.querySelector('.el-link.uk-button')?.href;

                return {
                    title,
                    websiteUrl,
                    address,
                    visitWebsiteUrl
                };
            });
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return null;
    }
}

const url = 'https://www.tagactive.co.uk/products/tagactivearena.html';
const outputFileJSON = 'scrapedData.json';
const outputFileCSV = 'scrapedData.csv';

scrapeTagActiveArena(url)
    .then(data => {
        if (data) {
            // Write data to JSON file
            jsonfile.writeFile(outputFileJSON, data, { spaces: 2 }, err => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                } else {
                    console.log(`Data saved to ${outputFileJSON}`);
                }
            });

            // Write data to CSV file
            const csvWriter = createObjectCsvWriter({
                path: outputFileCSV,
                header: [
                    { id: 'title', title: 'Title' },
                    { id: 'websiteUrl', title: 'Website URL' },
                    { id: 'address', title: 'Address' },
                    { id: 'visitWebsiteUrl', title: 'Visit Website URL' }
                ]
            });

            csvWriter.writeRecords(data)
                .then(() => console.log(`Data saved to ${outputFileCSV}`))
                .catch(err => console.error('Error writing CSV file:', err));
        } else {
            console.log('No data scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
