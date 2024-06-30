// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// // Function to scrape details from a single page
// async function scrapeDetails(url, retries = 3) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     let details = {};

//     try {
//         await page.goto(url, { waitUntil: 'domcontentloaded' });
//         await page.waitForSelector('.site-content', { timeout: 900000 });

//         details = await page.evaluate(() => {
//             const name = document.querySelector('.job_listing-title') ? document.querySelector('.job_listing-title').innerText.trim() : null;
//             const addressElement = document.querySelector('.job_listing-location.job_listing-location-formatted');
//             const address = addressElement ? addressElement.innerText.trim().replace(/\n/g, ', ') : null;
//             const addressLink = addressElement && addressElement.querySelector('a') ? addressElement.querySelector('a').href : null;
//             const website = document.querySelector('.job_listing-url') ? document.querySelector('.job_listing-url').innerText.trim() : null;
            
//             const hours = {};
//             const hoursElements = document.querySelectorAll('.widget-title-job_listing.ion-ios7-time-outline ~ .business-hour');
//             hoursElements.forEach(hourElement => {
//                 const day = hourElement.querySelector('.day') ? hourElement.querySelector('.day').innerText.trim() : null;
//                 const time = hourElement.querySelector('.business-hour-time') ? hourElement.querySelector('.business-hour-time').innerText.trim() : null;
//                 if (day && time) hours[day] = time;
//             });

//             const details = document.querySelector('.widget-title-job_listing.ion-ios7-compose-outline + p') ? document.querySelector('.widget-title-job_listing.ion-ios7-compose-outline + p').innerText.trim() : null;
//             const pricePerGame = document.querySelector('#jmfe-custom-price') ? document.querySelector('#jmfe-custom-price').innerText.trim() : null;

//             return { name, address, addressLink, website, hours, details, pricePerGame };
//         });

//     } catch (error) {
//         if (retries > 0) {
//             console.log(`Retrying (${retries} attempts left) for ${url}...`);
//             await browser.close();
//             return await scrapeDetails(url, retries - 1);
//         } else {
//             console.error(`Failed to scrape ${url} after multiple attempts.`);
//         }
//     } finally {
//         await browser.close();
//     }

//     return details;
// }

// // Function to read URLs from a file and process each one
// async function processLinks(file) {
//     const filePath = path.join(__dirname, file);
//     const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(url => url.trim());
//     const results = [];

//     for (const url of urls) {
//         console.log(`Processing ${url}...`);
//         const data = await scrapeDetails(url);
//         if (Object.keys(data).length > 0) {
//             results.push(data);
//         }
//     }

//     // Writing results to JSON file
//     fs.writeFileSync('20.Data.json', JSON.stringify(results, null, 2));
//     console.log('Data has been written to 20.Data.json');
// }

// // Adjust the path to your links.txt file
// processLinks('20.links.txt');



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
        await page.waitForSelector('.site-content', { timeout: 900000 });

        details = await page.evaluate(() => {
            const name = document.querySelector('.job_listing-title') ? document.querySelector('.job_listing-title').innerText.trim() : null;
            const addressElement = document.querySelector('.job_listing-location.job_listing-location-formatted');
            const address = addressElement ? addressElement.innerText.trim().replace(/\n/g, ', ') : null;
            const addressLink = addressElement && addressElement.querySelector('a') ? addressElement.querySelector('a').href : null;
            const website = document.querySelector('.job_listing-url') ? document.querySelector('.job_listing-url').innerText.trim() : null;
            
            const hours = {};
            const hoursElements = document.querySelectorAll('.widget-title-job_listing.ion-ios7-time-outline ~ .business-hour');
            hoursElements.forEach(hourElement => {
                const day = hourElement.querySelector('.day') ? hourElement.querySelector('.day').innerText.trim() : null;
                const time = hourElement.querySelector('.business-hour-time') ? hourElement.querySelector('.business-hour-time').innerText.trim() : null;
                if (day && time) hours[day] = time;
            });

            const details = document.querySelector('.widget-title-job_listing.ion-ios7-compose-outline + p') ? document.querySelector('.widget-title-job_listing.ion-ios7-compose-outline + p').innerText.trim() : null;
            const pricePerGame = document.querySelector('#jmfe-custom-price') ? document.querySelector('#jmfe-custom-price').innerText.trim() : null;

            return { name, address, addressLink, website, hours, details, pricePerGame };
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

// Function to read URLs from a JSON file and process each one
async function processLinks(file) {
    const filePath = path.join(__dirname, file);
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const results = [];

    for (const entry of entries) {
        const { url, name, address, phone } = entry;
        console.log(`Processing ${url}...`);
        const scrapedData = await scrapeDetails(url);
        if (Object.keys(scrapedData).length > 0) {
            results.push({
                name1: name,
                name2: scrapedData.name,
                address1: address,
                address2: scrapedData.address,
                phone,
                website: scrapedData.website,
                hours: scrapedData.hours,
                details: scrapedData.details,
                pricePerGame: scrapedData.pricePerGame,
                addressLink: scrapedData.addressLink,
            });
        }
    }

    // Writing results to JSON file
    fs.writeFileSync('20.Data.json', JSON.stringify(results, null, 2));
    console.log('Data has been written to 20.Data.json');
}

// Adjust the path to your JSON file
processLinks('20.links.json');
