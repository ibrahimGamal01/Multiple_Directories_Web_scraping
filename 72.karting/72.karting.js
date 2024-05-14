// const puppeteer = require('puppeteer');

// async function scrapeKartingData(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

//     const data = await page.evaluate(() => {
//         const results = [];
//         const tables = document.querySelectorAll('center > table > tbody > tr > td > table');

//         tables.forEach(table => {
//             try {
//                 const name = table.querySelector('font[size="3"]').innerText.trim();
//                 const imgLink = table.querySelector('td[rowspan="3"] img').src;
//                 const locationDescription = table.querySelector('td[bgcolor="#FDEF9F"]:nth-of-type(1)').innerText.trim();
//                 const phone = table.querySelector('img[alt="Tel: "] + font').innerText.trim();
//                 const website = table.querySelector('img[alt="Web: "] + font a').href;
//                 const description = table.querySelectorAll('td[bgcolor="#FDEF9F"]')[1].innerText.trim();
//                 const categoryMatch = locationDescription.match(/an\s+(.*)\s+circuit/);

//                 let category = categoryMatch ? categoryMatch[1] : 'Unknown';

//                 results.push({
//                     name,
//                     imgLink,
//                     description,
//                     phone,
//                     website,
//                     location: locationDescription,
//                     category,
//                     extra: null  // Add any extra data you might need here
//                 });
//             } catch (error) {
//                 console.error('Error processing table:', error);
//             }
//         });

//         return results;
//     });

//     await browser.close();
//     return data;
// }

// // Example URL - replace with actual
// const kartingUrl = 'http://www.karting.co.uk/Tracks/';
// scrapeKartingData(kartingUrl)
//     .then(data => console.log(data))
//     .catch(error => console.error('Scrape failed:', error));


// const puppeteer = require('puppeteer');

// async function scrapeKartingData(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(url, { timeout: 9000000 });

//     const data = await page.evaluate(() => {
//         const results = [];

//         // First format
//         const formatOneTables = document.querySelectorAll('center > table > tbody > tr > td > table');
//         formatOneTables.forEach(table => {
//             try {
//                 const name = table.querySelector('font[size="3"]').innerText.trim();
//                 const imgLink = table.querySelector('td[rowspan="3"] img').src;
//                 const locationDescription = table.querySelector('td[bgcolor="#FDEF9F"]:nth-of-type(1)').innerText.trim();
//                 const phone = table.querySelector('img[alt="Tel: "] + font').innerText.trim();
//                 const website = table.querySelector('img[alt="Web: "] + font a').href;
//                 const description = table.querySelectorAll('td[bgcolor="#FDEF9F"]')[1].innerText.trim();
//                 const categoryMatch = locationDescription.match(/an\s+(.*)\s+circuit/);
//                 const category = categoryMatch ? categoryMatch[1] : 'Unknown';

//                 results.push({
//                     name,
//                     imgLink,
//                     description,
//                     phone,
//                     website,
//                     location: locationDescription,
//                     category,
//                     extra: null  // Additional data if needed
//                 });
//             } catch (error) {
//                 console.error('Error processing table:', error);
//             }
//         });

//         // Second format
//         const formatTwoTables = document.querySelectorAll('center > table[width="550"]');
//         formatTwoTables.forEach(table => {
//             try {
//                 const name = table.querySelector('a[name]').innerText.trim();
//                 const location = table.querySelectorAll('td[bgcolor="#FDEF9F"]')[0].innerText.replace('Location: ', '').trim();
//                 const details = table.querySelectorAll('td[bgcolor="#FDEF9F"]')[1].innerText.trim();
//                 const phone = table.querySelector('img[alt="Tel: "] + font').innerText.trim();
//                 const moreInfoLink = table.querySelector('a[href^="TrackDetail.asp?TID="]').href;
//                 const categoryMatch = details.match(/An\s+(.*)\s+circuit/);
//                 const category = categoryMatch ? categoryMatch[1] : 'Unknown';

//                 results.push({
//                     name,
//                     imgLink: '', // Assume no image for this format
//                     description: details,
//                     phone,
//                     website: moreInfoLink, // Assuming the more info link as the website
//                     location,
//                     category,
//                     extra: null  // Additional data if needed
//                 });
//             } catch (error) {
//                 console.error('Error processing second format table:', error);
//             }
//         });

//         return results;
//     });

//     await browser.close();
//     return data;
// }

// const kartingUrl = 'http://www.karting.co.uk/Tracks/';
// scrapeKartingData(kartingUrl)
//     .then(data => console.log(data))
//     .catch(error => console.error('Scrape failed:', error));

// ! ------------------------------------------------------------------------------------

const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Import fs promises for writing files


async function scrapeKartingData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 9000000 });

    const data = await page.evaluate(() => {
        const results = [];

        // Generalized selector to handle variations in formatting
        const allTables = document.querySelectorAll('center > table[width="550"], center > table > tbody > tr > td > table');
        allTables.forEach(table => {
            try {
                const nameElement = table.querySelector('font[size="3"]') || table.querySelector('a[name]');
                const name = nameElement ? nameElement.innerText.trim() : 'Unknown';

                const imgElement = table.querySelector('td[rowspan="3"] img');
                const imgLink = imgElement ? imgElement.src : '';

                const locationElement = table.querySelector('td[bgcolor="#FDEF9F"]');
                const location = locationElement ? locationElement.innerText.replace('Location: ', '').trim() : 'Unknown';

                const phoneElement = table.querySelector('img[alt="Tel: "] + font');
                const phone = phoneElement ? phoneElement.innerText.trim() : 'Unknown';

                const faxElement = table.querySelector('img[alt="Fax: "] + font');
                const fax = faxElement ? faxElement.innerText.trim() : '';

                const websiteElement = table.querySelector('a[href^="TrackDetail.asp?TID="]');
                const website = websiteElement ? websiteElement.href : '';

                const detailsElement = table.querySelectorAll('td[bgcolor="#FDEF9F"]')[1];
                const details = detailsElement ? detailsElement.innerText.trim() : 'No details available';

                const categoryMatch = details.match(/An\s+(.*)\s+circuit/);
                const category = categoryMatch ? categoryMatch[1] : 'Unknown';

                results.push({
                    name,
                    imgLink,
                    description: details,
                    phone,
                    fax, // Optional fax info
                    website,
                    location,
                    category
                });
            } catch (error) {
                console.error('Error processing table:', table, error);
            }
        });

        return results;
    });

    await browser.close();
    return data;
}

const kartingUrl = 'http://www.karting.co.uk/Tracks/';
scrapeKartingData(kartingUrl)
    .then(data => {
        const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON with 2-space indentation
        return fs.writeFile('karting_data.json', jsonData); // Write JSON data to a file named karting_data.json
    })
    .then(() => console.log('Data written to karting_data.json'))
    .catch(error => console.error('Scrape and write failed:', error));
