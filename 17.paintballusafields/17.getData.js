// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeData(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

//         const data = await page.evaluate(() => {
//             const parkEntries = Array.from(document.querySelectorAll('.park-entry'));

//             const parks = parkEntries.map(entry => {
//                 const name = entry.querySelector('.park-name')?.innerText || null;
//                 const location = entry.querySelector('.park-location')?.innerText || null;
//                 const phoneAndWebsite = entry.innerText.match(/\d{3}-\d{3}-\d{4}\s+www\.[a-zA-Z0-9-]+\.com/g) || null;
//                 const phone = phoneAndWebsite ? phoneAndWebsite[0].split(' ')[0] : null;
//                 const website = phoneAndWebsite ? phoneAndWebsite[0].split(' ')[1] : null;
//                 const details = entry.innerText.replace(/\s+/g, ' ').trim();

//                 return { name, location, phone, website, details };
//             });

//             return parks;
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
//         console.log('Scraping data from https://www.paintballusafields.com/parks/');
//         const url = 'https://www.paintballusafields.com/parks/';
//         const result = await scrapeData(url);

//         if (!result.error) {
//             fs.writeFileSync('paintball_parks.json', JSON.stringify(result.data, null, 2));
//             console.log('Scraped data saved to paintball_parks.json');
//         } else {
//             console.error('Error scraping data:', result.error);
//         }
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
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const data = await page.evaluate(() => {
            const parkEntries = Array.from(document.querySelectorAll('.park-entry'));

            const parks = parkEntries.map(entry => {
                const name = entry.querySelector('.park-name')?.innerText || null;
                const location = entry.querySelector('.park-location')?.innerText || null;
                const phoneAndWebsite = entry.innerText.match(/\d{3}-\d{3}-\d{4}\s+www\.[a-zA-Z0-9-]+\.com/g) || null;
                const phone = phoneAndWebsite ? phoneAndWebsite[0].split(' ')[0] : null;
                const website = phoneAndWebsite ? phoneAndWebsite[0].split(' ')[1] : null;
                const details = entry.innerText.replace(/\s+/g, ' ').trim();

                // Check if Facebook link exists
                const facebookLink = entry.innerText.match(/(facebook\.com\/[a-zA-Z0-9-]+)/g);
                const facebook = facebookLink ? `https://${facebookLink[0]}` : null;

                return { name, location, phone, website, facebook, details };
            });

            return parks;
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
        console.log('Scraping data from https://www.paintballusafields.com/parks/');
        const url = 'https://www.paintballusafields.com/parks/';
        const result = await scrapeData(url);

        if (!result.error) {
            fs.writeFileSync('paintball_parks.json', JSON.stringify(result.data, null, 2));
            console.log('Scraped data saved to paintball_parks.json');
        } else {
            console.error('Error scraping data:', result.error);
        }
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAll();
