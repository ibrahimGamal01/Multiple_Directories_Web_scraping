const puppeteer = require('puppeteer');

// Function to extract links from divs with a specific class and structure
async function extractLinksFromDivs(page, url) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const links = await page.evaluate(() => {
        const divs = Array.from(document.querySelectorAll('div.unit[data-name]'));
        const validDivs = divs.filter(div => div.querySelector('a.unit_logo_wrap'));
        return validDivs.map(div => {
            const linkElement = div.querySelector('a.unit_logo_wrap');
            return linkElement ? linkElement.href : null;
        });
    });

    return links.filter(link => link !== null);
}

// Function to iterate over sites and scrape links
async function scrapeSitesForLinks(siteUrls) {
    const browser = await puppeteer.launch();

    for (const url of siteUrls) {
        const page = await browser.newPage();
        const links = await extractLinksFromDivs(page, url);
        console.log(`Links scraped from ${url}:`, links);
        await page.close();
    }

    await browser.close();
}

// List of sites to iterate over
const siteUrls = [
    'https://airsoftc3.com/us/hawaii/fields',
    'https://airsoftc3.com/us/indiana/fields'
];

// Call the function to scrape sites for links
scrapeSitesForLinks(siteUrls);

