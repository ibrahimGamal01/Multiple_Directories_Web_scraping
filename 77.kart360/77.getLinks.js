const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeKart360Links(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url);
        await page.waitForSelector('.ais-InfiniteHits-item');

        // Loop over clicking "Show more results" button
        let numClicks = 0;
        while (true) {
            console.log(`Clicking "Show more results" - Attempt ${numClicks + 1}...`);
            await page.click('.ais-InfiniteHits-loadMore');
            // waiting for network connection will cause several errors (the runtime at this time is a few seconds)
            await delay(200);
            await page.waitForSelector('.ais-InfiniteHits-item', { timeout: 30000 }).catch(() => {
                console.log('No more results to load.');
            });
            numClicks++;

            // Exit loop if no more results or after 3 clicks
            if (numClicks >= 20) {
                break;
            }
        }

        console.log('Scraping links...');
        const links = await page.evaluate(() => {
            const linkElements = Array.from(document.querySelectorAll('.ais-InfiniteHits-item a'));
            return linkElements.map(link => link.href);
        });

        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        return null;
    } finally {
        await browser.close();
    }
}

// Function to delay execution for a specified time
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'https://kart360.com/directory';
const outputFile = 'links.txt';

scrapeKart360Links(url)
    .then(links => {
        if (links && links.length > 0) {
            fs.writeFileSync(outputFile, links.join('\n'));
            console.log(`Scraping completed. Links saved to ${outputFile}`);
        } else {
            console.log('No links scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
