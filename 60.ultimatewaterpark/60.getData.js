// // const puppeteer = require('puppeteer');

// // async function scrapeData() {
// //     const browser = await puppeteer.launch();
// //     const page = await browser.newPage();

// //     // Navigate to the page
// //     await page.goto('https://www.ultimatewaterpark.com/waterparks/boomerang-bay_ca.html');

// //     // Extract data
// //     const data = await page.evaluate(() => {
// //         const title = document.querySelector('h1').innerText;
// //         const details = document.querySelector('.wpListing p').innerText;
// //         const parkType = document.querySelector('.wp-factbox p:nth-of-type(1)').innerText.split(': ')[1];
// //         const website = document.querySelector('.wpLocation a').href;
// //         const rating = document.querySelector('.ratingblock strong').innerText;
// //         const addressAndPhone = document.querySelector('.wpLocation').innerText;
// //         const address = addressAndPhone.match(/([0-9]{1,5}[^,]+?,[^0-9]+?[0-9]{5})/)[0].trim();
// //         const phone = addressAndPhone.match(/\(([^)]+)\)/)[1];
// //         const openHours = document.querySelector('.wp-factbox p:nth-of-type(3)').innerText;
// //         const admissionPrices = document.querySelector('.wp-factbox p:nth-of-type(4)').innerText;

// //         return {
// //             title,
// //             details,
// //             parkType,
// //             website,
// //             rating,
// //             address,
// //             phone,
// //             openHours,
// //             admissionPrices
// //         };
// //     });

// //     await browser.close();
// //     return data;
// // }

// // // Usage
// // scrapeData().then(data => console.log(data)).catch(error => console.error(error));


// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeData(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

//         const data = await page.evaluate(() => {
//             const title = document.querySelector('h1').innerText;
//             const details = document.querySelector('.wpListing p').innerText;
//             const parkType = document.querySelector('.wp-factbox p:nth-of-type(1)').innerText.split(': ')[1];
//             const website = document.querySelector('.wpLocation a').href;
//             const rating = document.querySelector('.ratingblock strong').innerText;
//             const addressAndPhone = document.querySelector('.wpLocation').innerText;
//             const address = addressAndPhone.match(/([0-9]{1,5}[^,]+?,[^0-9]+?[0-9]{5})/)[0].trim();
//             const phone = addressAndPhone.match(/\(([^)]+)\)/)[1];
//             const openHours = document.querySelector('.wp-factbox p:nth-of-type(3)').innerText;
//             const admissionPrices = document.querySelector('.wp-factbox p:nth-of-type(4)').innerText;

//             return {
//                 title,
//                 details,
//                 parkType,
//                 website,
//                 rating,
//                 address,
//                 phone,
//                 openHours,
//                 admissionPrices
//             };
//         });

//         await browser.close();
//         return { url, data };
//     } catch (error) {
//         console.error(`Error scraping ${url}: ${error}`);
//         await browser.close();
//         return { url, error: error.message };
//     }
// }

// async function scrapeAll() {
//     try {
//         console.log('Scrape data from links in links.txt');
//         const links = fs.readFileSync('links.txt', 'utf8').split('\n').map(link => link.trim()).filter(Boolean);
//         const scrapedData = [];

//         for (let url of links) {
//             console.log('Scrape data from link: ' + url);
//             const result = await scrapeData(url);
//             scrapedData.push(result);
//         }

//         fs.writeFileSync('60.Data.json', JSON.stringify(scrapedData, null, 2));
//         console.log('Scraped data saved to 60.Data.json');
//     } catch (error) {
//         console.error('Error scraping data:', error);
//     }
// }

// // Usage
// scrapeAll();


const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 50000 });

        const data = await page.evaluate(() => {
            const titleElement = document.querySelector('h1');
            const detailsElement = document.querySelector('.wpListing p');
            const parkTypeElement = document.querySelector('.wp-factbox p:nth-of-type(1)');
            const websiteElement = document.querySelector('.wpLocation a');
            const ratingElement = document.querySelector('.ratingblock strong');
            const addressAndPhoneElement = document.querySelector('.wpLocation');
            const openHoursElement = document.querySelector('.wp-factbox p:nth-of-type(3)');
            const admissionPricesElement = document.querySelector('.wp-factbox p:nth-of-type(4)');

            const title = titleElement ? titleElement.innerText : null;
            const details = detailsElement ? detailsElement.innerText : null;
            const parkType = parkTypeElement ? parkTypeElement.innerText.split(': ')[1] : null;
            const website = websiteElement ? websiteElement.href : null;
            const rating = ratingElement ? ratingElement.innerText : null;
            const addressAndPhone = addressAndPhoneElement ? addressAndPhoneElement.innerText : null;
            const address = addressAndPhone ? addressAndPhone.match(/([0-9]{1,5}[^,]+?,[^0-9]+?[0-9]{5})/)[0].trim() : null;
            const phone = addressAndPhone ? addressAndPhone.match(/\(\d{3}\)\s*\d{3}-\d{4}/)[0] : null;
            const openHours = openHoursElement ? openHoursElement.innerText : null;
            const admissionPrices = admissionPricesElement ? admissionPricesElement.innerText : null;

            return {
                title,
                details,
                parkType,
                website,
                rating,
                address,
                phone,
                openHours,
                admissionPrices
            };
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
        console.log('Scraping data from links in links.txt');
        const links = fs.readFileSync('links.txt', 'utf8').split('\n').map(link => link.trim()).filter(Boolean);
        const scrapedData = [];

        for (let url of links) {
            console.log('Scraping data from link: ' + url);
            let retryCount = 3;
            let success = false;

            while (retryCount > 0 && !success) {
                const result = await scrapeData(url);
                if (!result.error) {
                    scrapedData.push(result);
                    success = true;
                } else {
                    console.error(`Error scraping ${url}: ${result.error}`);
                    retryCount--;
                    console.log(`Retrying ${url} (${retryCount} attempts left)`);
                }
            }
        }

        fs.writeFileSync('60.Data.json', JSON.stringify(scrapedData, null, 2));
        console.log('Scraped data saved to 60.Data.json');
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAll();
