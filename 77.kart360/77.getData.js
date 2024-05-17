// // const puppeteer = require('puppeteer');

// // async function scrapeDetails(url) {
// //     const browser = await puppeteer.launch();
// //     const page = await browser.newPage();

// //     try {
// //         await page.goto(url);

// //         // Wait for the necessary elements to ensure they are loaded
// //         await page.waitForSelector('.u-text-xl');
// //         await page.waitForSelector('.o-List-item');

// //         // Extracting details
// //         const details = await page.evaluate(() => {
// //             const name = document.querySelector('.u-text-xl a') ? document.querySelector('.u-text-xl a').innerText : null;
// //             const phone = document.querySelector('a[href^="tel:"]') ? document.querySelector('a[href^="tel:"]').innerText : null;
// //             const address = document.querySelectorAll('.o-List-item .o-media__body')[1] ? document.querySelectorAll('.o-List-item .o-media__body')[1].innerText : null;
// //             const imgURL = document.querySelector('.u-mr-4 a img') ? document.querySelector('.u-mr-4 a img').src : null;
        
// //             return { name, phone, address, imgURL };
// //         });
        

// //         console.log(details);
// //         return details;

// //     } catch (error) {
// //         console.error('Error during scraping:', error);
// //         return {};
// //     } finally {
// //         await browser.close();
// //     }
// // }

// // const url = 'https://kart360.com/tb-kart-usa';
// // scrapeDetails(url);


// const puppeteer = require('puppeteer');

// async function scrapeDetails(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto(url);

//         // Wait for the necessary elements to ensure they are loaded
//         await page.waitForSelector('.u-text-xl');
//         await page.waitForSelector('.o-List-item');

//         // Extracting details
//         const details = await page.evaluate(() => {
//             const name = document.querySelector('.u-text-xl a') ? document.querySelector('.u-text-xl a').innerText : null;
//             const phone = document.querySelector('a[href^="tel:"]') ? document.querySelector('a[href^="tel:"]').innerText : null;
//             const address = document.querySelectorAll('.o-List-item .o-media__body')[1] ? document.querySelectorAll('.o-List-item .o-media__body')[1].innerText : null;
//             const imgURL = document.querySelector('.u-mr-4 a img') ? document.querySelector('.u-mr-4 a img').src : null;
//             const website = document.querySelector('.o-List-item .o-media__body a.u-colorBase') ? document.querySelector('.o-List-item .o-media__body a.u-colorBase').href : null;

//             return { name, phone, address, imgURL, website };
//         });

//         console.log(details);
//         return details;

//     } catch (error) {
//         console.error('Error during scraping:', error);
//         return {};
//     } finally {
//         await browser.close();
//     }
// }

// const url = 'https://kart360.com/tb-kart-usa';
// scrapeDetails(url);


const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Function to scrape details from a single page
async function scrapeDetails(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url);
        await page.waitForSelector('.u-text-xl');
        await page.waitForSelector('.o-List-item');

        const details = await page.evaluate(() => {
            const name = document.querySelector('.u-text-xl a') ? document.querySelector('.u-text-xl a').innerText.trim() : null;
            const phone = document.querySelector('a[href^="tel:"]') ? document.querySelector('a[href^="tel:"]').innerText.trim() : null;
            const address = document.querySelectorAll('.o-List-item .o-media__body')[1] ? document.querySelectorAll('.o-List-item .o-media__body')[1].innerText.trim() : null;
            const imgURL = document.querySelector('.u-mr-4 a img') ? document.querySelector('.u-mr-4 a img').src : null;
            const website = document.querySelector('.o-List-item .o-media__body a.u-colorBase') ? document.querySelector('.o-List-item .o-media__body a.u-colorBase').href : null;
            return { name, phone, address, imgURL, website };
        });

        return details;

    } catch (error) {
        console.error('Error during scraping:', error);
        return {};
    } finally {
        await browser.close();
    }
}

// Function to read URLs from a file and process each one
async function processLinks(file) {
    const filePath = path.join(__dirname, file);
    const urls = fs.readFileSync(filePath, 'utf-8').split('\n');
    const results = [];

    for (const url of urls) {
        console.log(`Processing ${url}...`);
        const data = await scrapeDetails(url);
        results.push(data);
    }

    // Writing results to JSON file
    fs.writeFileSync('77.Data.json', JSON.stringify(results, null, 2));
    console.log('Data has been written to 77.Data.json');
}

// Adjust the path to your links.txt file
processLinks('links.txt');
