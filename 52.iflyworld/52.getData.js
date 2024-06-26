// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeIFlyHollywood() {
//     const url = 'https://www.iflyworld.com/tampa/';
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto(url);
//         await page.waitForSelector('.revised-location-info');

//         const details = await page.evaluate(() => {
//             const name = document.querySelector('title') ? document.querySelector('title').innerText.trim() : null;
//             const imgLink = document.querySelector('.location-img-container img') ? document.querySelector('.location-img-container img').src : null;
//             const address = document.querySelector('.cre-18-location-address span') ? document.querySelector('.cre-18-location-address span').innerText.trim() : null;
//             const addressLink = document.querySelector('.cre-18-get-direction-btn a') ? document.querySelector('.cre-18-get-direction-btn a').href : null;
//             const phoneNo = document.querySelector('.cre-18-phoneNo-mob span') ? document.querySelector('.cre-18-phoneNo-mob span').innerText.trim() : null;
//             const email = document.querySelector('.cre-18-Email-mob') ? document.querySelector('.cre-18-Email-mob').innerText.trim() : null;

//             const hours = {};
//             const hoursRows = document.querySelectorAll('#opening_hours .date-time');
//             hoursRows.forEach(row => {
//                 const day = row.querySelector('.Day').innerText.trim();
//                 const timing = row.querySelector('.timeing').innerText.trim();
//                 hours[day] = timing;
//             });

//             return { name, imgLink, address, addressLink, phoneNo, email, hours };
//         });

//         console.log(details);
//         fs.writeFileSync('ifly_hollywood_data.json', JSON.stringify(details, null, 2));
//         console.log('Data has been written to ifly_hollywood_data.json');

//     } catch (error) {
//         console.error('Error during scraping:', error);
//     } finally {
//         await browser.close();
//     }
// }

// scrapeIFlyHollywood();



const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Function to scrape details from a single page
async function scrapeDetails(url, retries = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let details = {};

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.revised-location-info', { timeout: 5000 });

        details = await page.evaluate(() => {
            const name = document.querySelector('title') ? document.querySelector('title').innerText.trim() : null;
            const imgLink = document.querySelector('.location-img-container img') ? document.querySelector('.location-img-container img').src : null;
            const address = document.querySelector('.cre-18-location-address span') ? document.querySelector('.cre-18-location-address span').innerText.trim() : null;
            const addressLink = document.querySelector('.cre-18-get-direction-btn a') ? document.querySelector('.cre-18-get-direction-btn a').href : null;
            const phoneNo = document.querySelector('.cre-18-phoneNo-mob span') ? document.querySelector('.cre-18-phoneNo-mob span').innerText.trim() : null;
            const email = document.querySelector('.cre-18-Email-mob') ? document.querySelector('.cre-18-Email-mob').innerText.trim() : null;

            const hours = {};
            const hoursRows = document.querySelectorAll('#opening_hours .date-time');
            hoursRows.forEach(row => {
                const day = row.querySelector('.Day').innerText.trim();
                const timing = row.querySelector('.timeing').innerText.trim();
                hours[day] = timing;
            });

            return { name, imgLink, address, addressLink, phoneNo, email, hours };
        });

    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying (${retries} attempts left) for ${url}...`);
            await browser.close();
            return await scrapeDetails(url, retries - 1);
        } else {
            console.error(`Failed to scrape ${url} after multiple attempts.`);
        }
    } finally {
        await browser.close();
    }

    return details;
}

// Function to read URLs from a file and process each one
async function processLinks(file) {
    const filePath = path.join(__dirname, file);
    const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(url => url.trim());
    const results = [];

    for (const url of urls) {
        console.log(`Processing ${url}...`);
        const data = await scrapeDetails(url);
        if (Object.keys(data).length > 0) {
            results.push(data);
        }
    }

    // Writing results to JSON file
    fs.writeFileSync('52.Data.json', JSON.stringify(results, null, 2));
    console.log('Data has been written to ifly_data.json');
}

// Adjust the path to your links.txt file
processLinks('52.links.txt');
