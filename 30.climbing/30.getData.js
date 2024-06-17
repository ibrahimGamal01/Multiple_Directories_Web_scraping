const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape links from the main page
async function scrapeClimbingGymLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const links = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('.js-wpv-loop-wrapper .tb-grid-column a');
            const urls = Array.from(linkElements).map(anchor => anchor.href);
            return urls;
        });

        console.log('Scraped Links:', links);
        return links;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

// Function to scrape detailed information from each gym link
async function scrapeClimbingGymDetails(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to gym URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const details = await page.evaluate(() => {
            const name = document.querySelector('h2.tb-heading')?.innerText || null;
            const description = document.querySelector('.tb-field[data-toolset-blocks-field="f1330dc6d703194efd3fa64d57fe0ce2"]')?.innerText || null;
            const address = document.querySelector('.tb-field[data-toolset-blocks-field="462e8f9b6b4bca3c2364c40acb5942b1"]')?.innerText || null;
            const contact = document.querySelector('.tb-field[data-toolset-blocks-field="a38e81b8e1a442af17d185caff927171"]')?.innerText || null;
            const email = document.querySelector('.tb-field[data-toolset-blocks-field="30c4eba4fcea18011c75ea5e984baf5b"] a')?.innerText || null;
            const website = document.querySelector('.tb-field[data-toolset-blocks-field="682b228bf21c89d6f8624c6073bdf4a1"] a')?.href || null;
            const openingHours = Array.from(document.querySelectorAll('.tb-field[data-toolset-blocks-field="067b0072b9538336985994baef6915c9"] div, .tb-field[data-toolset-blocks-field="067b0072b9538336985994baef6915c9"] ul li'))
                                       .map(el => el.innerText) || null;

            return {
                name,
                description,
                address,
                contact: {
                    phone: contact,
                    email: email
                },
                details: description,
                website,
                openingHours: openingHours
            };
        });

        console.log('Scraped Details:', details);
        return details;
    } catch (error) {
        console.error(`Error scraping gym details from URL ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

async function runScraping() {
    const inputFilePath = 'extracted_links.txt';
    const outputFilePath = 'climbingGymsData.json';

    // Read the file containing the URLs
    const urls = fs.readFileSync(inputFilePath, 'utf-8').split('\n').filter(Boolean);
    
    let allGymDetails = [];
    for (const url of urls) {
        const details = await scrapeClimbingGymDetails(url);
        if (details) {
            allGymDetails.push(details);
        }
    }

    if (allGymDetails.length > 0) {
        fs.writeFileSync(outputFilePath, JSON.stringify(allGymDetails, null, 2), 'utf8');
        console.log(`Scraping completed. Data saved to ${outputFilePath}`);
    } else {
        console.log('No gym details scraped.');
    }
}

runScraping().catch(error => console.error('Error:', error));
