const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeArrowTagLocations(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Loop over clicking the "Load More" button 90 times with error handling
        for (let i = 0; i < 93; i++) {
            console.log(`Clicking the "Load More" button - Attempt ${i + 1}...`);

            try {
                await page.click('.javo-map-box-morebutton');
                console.log('Waiting for 5 seconds...');
                await delay(5000);
            } catch (error) {
                console.error(`Error clicking the "Load More" button on attempt ${i + 1}:`, error);

                // Retry mechanism
                let retryCount = 0;
                while (retryCount < 3) {
                    try {
                        console.log(`Retrying click - Attempt ${i + 1}, Retry ${retryCount + 1}...`);
                        await page.click('.javo-map-box-morebutton');
                        console.log('Waiting for 5 seconds...');
                        await delay(5000);
                        break; // Exit retry loop if successful
                    } catch (retryError) {
                        console.error(`Retry ${retryCount + 1} failed:`, retryError);
                        retryCount++;
                        await delay(2000); // Wait before retrying
                    }
                }

                if (retryCount === 3) {
                    console.error(`Skipping click on attempt ${i + 1} after 3 retries.`);
                }
            }
        }

        // Wait for the content to load after clicking "Load More"
        console.log('Waiting for the additional content to load...');
        await page.waitForSelector('.one-block-whole-link');

        console.log('Scraping links...');
        const links = await page.evaluate(() => {
            const links = [];
            const linkElements = document.querySelectorAll('a.one-block-whole-link');
            linkElements.forEach(link => {
                links.push(link.href);
            });
            return links;
        });

        await browser.close();
        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return null;
    }
}

// Function to delay execution for a specified time
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'https://arrowtag.com/locations/';
const outputFile = 'arrowtag_locations.txt';

scrapeArrowTagLocations(url)
    .then(links => {
        if (links) {
            fs.writeFileSync(outputFile, links.join('\n'));
            console.log(`Scraping completed. Links saved to ${outputFile}`);
        } else {
            console.log('No links scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
