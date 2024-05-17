// ! Extract links separate 
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeLinks(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         // Navigate to the specified URL
//         await page.goto(url);

//         // Wait for the table with links to load
//         await page.waitForSelector('tbody[role="alert"]');

//         // Extract links from the table
//         const links = await page.evaluate(() => {
//             const linkElements = document.querySelectorAll('tbody[role="alert"] a[href^="/skate-times/rink/"]');
//             return Array.from(linkElements, link => link.href);
//         });

//         // Save the links to links.txt
//         const filename = `${url.split('/').pop()}_links.txt`;
//         fs.writeFileSync(filename, links.join('\n'));
//         console.log(`Links saved to ${filename}`);

//     } catch (error) {
//         console.error('Error scraping links:', error);
//     } finally {
//         await browser.close();
//     }
// }

// // List of states
// // const states = ['AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'IN', 'KS', 'KY', 'ME', 'MA', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'SC', 'SD', 'TN', 'TX', 'UT', 'WA', 'WI', 'WY', 'WV', 'VA', 'BC', 'NS', 'NIJ', 'ON', 'QC', 'SK'];

// const states = ['AR', 'CA']

// // Loop through states and scrape links
// states.forEach(state => {
//     const url = `https://www.hockeyfinder.com/rink-directory/${state}`;
//     scrapeLinks(url);
// });

// ! Extract all links as one file 

const fs = require('fs');
const { timeout } = require('puppeteer');
const puppeteer = require('puppeteer');

async function scrapeLinks(url) {
    const browser = await puppeteer.launch({ headless: true, timeout: 60000 });
    const page = await browser.newPage({timeout: 60000});

    try {
        // Navigate to the specified URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000});

        // Wait for the table with links to load
        await page.waitForSelector('tbody[role="alert"]');

        // Extract links from the table
        const links = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('tbody[role="alert"] a[href^="/skate-times/rink/"]');
            return Array.from(linkElements, link => link.href);
        });

        return links;

    } catch (error) {
        console.error('Error scraping links:', error);
        return [];
    } finally {
        await browser.close();
    }
}

async function scrapeAllStatesLinks(states) {
    const allLinks = [];

    for (const state of states) {
        const url = `https://www.hockeyfinder.com/rink-directory/${state}`;
        const links = await scrapeLinks(url);
        allLinks.push(...links);
    }

    return allLinks;
}

async function saveLinksToFile(links) {
    const filename = '70.links.txt';
    fs.writeFileSync(filename, links.join('\n'));
    console.log(`All links saved to ${filename}`);
}

// List of states
const states = ['AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'IN', 'KS', 'KY', 'ME', 'MA', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'SC', 'SD', 'TN', 'TX', 'UT', 'WA', 'WI', 'WY', 'WV', 'VA', 'BC', 'NS', 'NIJ', 'ON', 'QC', 'SK'];

// Scrape links for all states
scrapeAllStatesLinks(states)
    .then(allLinks => saveLinksToFile(allLinks))
    .catch(error => console.error('Error scraping links:', error));
