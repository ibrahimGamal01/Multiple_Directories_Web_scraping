const puppeteer = require('puppeteer');
const fs = require('fs/promises'); // Use fs promises for writing files

async function scrapeKartingData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log(`Navigating to ${url}`);
        await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

        console.log('Extracting data...');
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

        console.log('Data extraction complete');
        return data;
    } catch (error) {
        console.error('Error during scraping:', error);
        return [];
    } finally {
        await browser.close();
    }
}

async function runScrape() {
    const kartingUrl = 'http://www.karting.co.uk/Tracks/';
    try {
        const data = await scrapeKartingData(kartingUrl);
        if (data.length > 0) {
            const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON with 2-space indentation
            await fs.writeFile('72.Data.json', jsonData); // Write JSON data to a file named 72.Data.json
            console.log('Data successfully written to 72.Data.json');
        } else {
            console.log('No data to write');
        }
    } catch (error) {
        console.error('Scrape and write failed:', error);
    }
}

runScrape();
