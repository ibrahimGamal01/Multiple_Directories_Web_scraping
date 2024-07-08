const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to extract links from divs with a specific class and structure with error handling and retry
async function extractLinksFromDivs(page, url) {
    let retryCount = 0;
    let links = [];

    while (retryCount < 3) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.waitForSelector('div.unit[data-name]', { timeout: 5000 });

            links = await page.evaluate(() => {
                const divs = Array.from(document.querySelectorAll('div.unit[data-name]'));
                const validDivs = divs.filter(div => div.querySelector('a.unit_logo_wrap'));
                return validDivs.map(div => {
                    const linkElement = div.querySelector('a.unit_logo_wrap');
                    return linkElement ? linkElement.href : null;
                });
            });
            break; // Exit the loop if successful
        } catch (error) {
            console.error(`Error accessing ${url}: ${error.message}`);
            retryCount++;
            console.log(`Retrying (${retryCount}/3)...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
        }
    }

    return links.filter(link => link !== null);
}

// Function to generate URLs for each state and scrape links with error handling and retry
async function scrapeSitesForLinks(states) {
    const browser = await puppeteer.launch();
    const linksByState = {};

    for (const state of states) {
        const url = `https://airsoftc3.com/us/${state.toLowerCase().replace(/\s+/g, '')}/fields`;
        const page = await browser.newPage();
        
        let links = [];
        try {
            links = await extractLinksFromDivs(page, url);
            console.log(`Links scraped from ${state}:`, links);
            linksByState[state] = links;
        } catch (error) {
            console.error(`Error scraping links for ${state}: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();

    // Save the linksByState object as a JSON file
    fs.writeFileSync('linksByState.json', JSON.stringify(linksByState, null, 2));
    console.log('Data saved to linksByState.json');
}

// List of states to generate URLs for
const states = [
    'Alabama', 'Alaska'
];
// const states = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
//     'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
//     'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
//     'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
//     'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
//     'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];

// Call the function to scrape sites for links for each state
scrapeSitesForLinks(states);
