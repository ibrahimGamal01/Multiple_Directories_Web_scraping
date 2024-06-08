const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeRinkData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to the specified URL
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for the relevant elements to load
        await page.waitForSelector('.page-title', { visible: true });
        await page.waitForSelector('table[width="100%"] a[target="_blank"]', { visible: true });

        // Extract data from the page
        const data = await page.evaluate(() => {
            const pageTitle = document.querySelector('.page-title').innerText.trim();
            const addressElement = document.querySelector('table[width="100%"] a[href^="http"]').innerText.trim();
            const addressURL = document.querySelector('table[width="100%"] a[href^="http"]').href;
            let phone = '';
            const phoneElement = document.querySelector('table[width="100%"]').innerText.match(/\(\d{3}\)\s*\d{3}-\d{4}/);
            if (phoneElement) {
                phone = phoneElement[0];
            }
            let websiteURL = '';
            const websiteLinks = document.querySelectorAll('table[width="100%"] a[target="_blank"]');
            if (websiteLinks.length > 1) {
                websiteURL = websiteLinks[1].href;
            } else if (websiteLinks.length === 1) {
                websiteURL = websiteLinks[0].href;
            }
            return {
                Name: pageTitle,
                Address: addressElement.split('\n').slice(0, 2).join(', '),
                AddressURL: addressURL,
                Phone: phone,
                Website: websiteURL
            };
        });

        return data;

    } catch (error) {
        console.error(`Error scraping rink data from ${url}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Read links from links.txt file
const linksFilePath = '70.links.txt';
const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').map(link => link.trim());

// Scrape data for each link
const scrapedData = [];
const maxRetries = 3;

async function scrapeAllLinks() {
    for (const link of links) {
        let success = false;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const data = await scrapeRinkData(link);
                scrapedData.push(data);
                success = true;
                console.log(`Successfully scraped data from ${link}`);
                break;
            } catch (error) {
                console.error(`Attempt ${attempt} failed for ${link}`);
                if (attempt === maxRetries) {
                    console.error(`Failed to scrape data from ${link} after ${maxRetries} attempts, skipping...`);
                } else {
                    // Optional: Add a delay before retrying
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }
    }

    // Save scraped data to a JSON file
    fs.writeFileSync('70.Data.json', JSON.stringify(scrapedData, null, 2));
    console.log('Scraped data saved to 70.Data.json');
}

// Start scraping
scrapeAllLinks().catch(error => console.error('Error scraping links:', error));
