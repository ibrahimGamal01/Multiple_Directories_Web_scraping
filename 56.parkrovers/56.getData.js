// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto('https://parkrovers.com/united-parks', { waitUntil: 'networkidle2' });

//     const data = await page.evaluate(() => {
//         const extractText = (element, selector) => {
//             const el = element.querySelector(selector);
//             return el ? el.textContent.trim() : 'N/A';
//         };

//         const parks = [];
//         const parkElements = document.querySelectorAll('.sqs-block.html-block.sqs-block-html');

//         parkElements.forEach(parkElement => {
//             const parkItems = parkElement.querySelectorAll('ol li');

//             parkItems.forEach(item => {
//                 const name = extractText(item, 'p strong');
//                 const location = extractText(item, 'ul li:nth-child(1) p');
//                 const openingDate = extractText(item, 'ul li:nth-child(2) p');
//                 const area = extractText(item, 'ul li:nth-child(3) p');

//                 parks.push({
//                     name,
//                     location,
//                     openingDate,
//                     area
//                 });
//             });
//         });

//         return parks;
//     });

//     console.log(JSON.stringify(data, null, 2));
//     await browser.close();
// })();

const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeUnitedParks() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const url = 'https://parkrovers.com/united-parks';
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increased timeout to 60 seconds

        // Evaluate the page and extract data
        const data = await page.evaluate(() => {
            const results = [];

            const blocks = document.querySelectorAll('.sqs-block-content .sqs-html-content ol li');

            blocks.forEach(block => {
                const nameElement = block.querySelector('p strong');
                if (!nameElement) return;

                const name = nameElement.textContent.trim();

                const detailsElements = block.querySelectorAll('ul li p');
                const location = detailsElements[0]?.textContent.trim() || '';
                const openingDate = detailsElements[1]?.textContent.includes('Opening date') ? detailsElements[1].textContent.replace('Opening date:', '').trim() : '';
                const area = detailsElements[2]?.textContent.includes('Area') ? detailsElements[2].textContent.replace('Area:', '').trim() : '';

                results.push({
                    Name: name,
                    Location: location,
                    OpeningDate: openingDate,
                    Area: area
                });
            });

            return results;
        });

        await browser.close();

        // Write data to JSON file
        const outputFile = '56.Data.json';
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log(`Data has been scraped and saved to ${outputFile}`);
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
    }
}

// Run the scraping function
scrapeUnitedParks();
