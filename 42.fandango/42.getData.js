const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchTheaterDetails(url, retries = 1) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    while (retries > 0) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

            // Wait for the relevant content to load
            await page.waitForSelector('.theater-details-header__heading', { timeout: 60000 });

            // Click the button to reveal the phone number if it's not already visible
            const buttonSelector = '#theater-amenities-overlay-open-btn';
            if (await page.$(buttonSelector) !== null) {
                await page.click(buttonSelector);
                await page.waitForSelector('#theater-details-amenities .theater-amenities-overlay__section p', { timeout: 60000 });
            }

            // Extract the details
            const details = await page.evaluate(() => {
                const name = document.querySelector('.theater-details-header__heading')?.innerText.trim() || '';
                const imglink = document.querySelector('.theater-details-header__chain-logo')?.src || '';
                const addressElement = document.querySelector('.theater-details-header__addy');
                const address = addressElement?.innerText.replace(/\n/g, ' ').trim() || '';
                const addressLink = addressElement?.href || '';
                
                // Extract phone number from the specified section
                const phone = document.querySelector('#theater-details-amenities .theater-amenities-overlay__section p')?.innerText.trim() || '';

                return { 
                    name, 
                    imglink, 
                    address, 
                    addressLink, 
                    phone
                };
            });

            await browser.close();
            return details;
        } catch (error) {
            console.error(`Error fetching details from ${url}: ${error.message}. Retries left: ${retries - 1}`);
            retries -= 1;
            if (retries === 0) {
                await browser.close();
                return null;
            }
        }
    }
}

async function main() {
    const linksFile = '42.locations.txt';
    const urls = fs.readFileSync(linksFile, 'utf-8').trim().split('\n').map(url => url.trim());

    let theaterDetails = [];

    for (const url of urls) {
        console.log(`Fetching details from ${url}...`);
        const details = await fetchTheaterDetails(url);
        if (details) {
            theaterDetails.push(details);
        } else {
            console.log(`Skipping ${url} due to repeated errors.`);
        }
    }

    const outputFilePath = 'theater_details.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(theaterDetails, null, 2));
    console.log(`Theater details have been written to ${outputFilePath}`);
}

main();