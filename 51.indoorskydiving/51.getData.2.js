
// Path: 51.indoorskydiving/51.getData.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const urls = fs.readFileSync('51.links.txt', 'utf-8').trim().split('\n');
    const data = [];

    for (const url of urls) {
        console.log('Scraping:', url);

        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            const tunnelData = await page.evaluate(() => {
                const getTextContent = (selector) => document.querySelector(selector)?.textContent.trim() || null;
                const getHref = (selector) => document.querySelector(selector)?.href.trim() || null;

                const nameParts = window.location.pathname.split('/').filter(Boolean).pop().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1));
                const name = nameParts.join(' ');

                const fullAddress = getTextContent('.mh-col-1-2.entry-content .su-table tr:nth-child(1) td:nth-child(2)');
                const addressLink = getHref('.mh-col-1-2.entry-content .su-table tr:nth-child(2) a');
                const CityLink = getHref('.mh-col-1-2.entry-content .su-table tr:nth-child(3) a');
                let CityName = getTextContent('.mh-col-1-2.entry-content .su-table tr:nth-child(3) a');

                // Filter out email addresses from CityName
                if (CityName && CityName.includes('@')) {
                    CityName = null;
                }

                const stateAndCountryText = getTextContent('.mh-col-1-2.entry-content .su-table tr:nth-child(4) a:last-child');
                const stateAndCountryLink = getHref('.mh-col-1-2.entry-content .su-table tr:nth-child(4) a:last-child');

                const domesticPhoneNumber = getTextContent('.mh-col-1-2.entry-content:nth-of-type(2) .su-table tr:nth-child(1) td:nth-child(2)');
                const internationalPhoneNumber = getTextContent('.mh-col-1-2.entry-content:nth-of-type(2) .su-table tr:nth-child(2) td:nth-child(2)');
                const email = getTextContent('.mh-col-1-2.entry-content:nth-of-type(2) .su-table tr:nth-child(3) a');
                const emailLink = getHref('.mh-col-1-2.entry-content:nth-of-type(2) .su-table tr:nth-child(3) a');
                const website = getHref('.mh-col-1-2.entry-content:nth-of-type(2) .su-table tr:nth-child(4) a');

                return {
                    name,
                    fullAddress,
                    addressLink,
                    CityLink,
                    CityName,
                    stateAndCountryText,
                    stateAndCountryLink,
                    domesticPhoneNumber,
                    internationalPhoneNumber,
                    email,
                    emailLink,
                    website,
                };
            });

            data.push(tunnelData);
        } catch (error) {
            console.error(`Error scraping ${url}:`, error.message);
        }
    }

    fs.writeFileSync('51.Data.2.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to 51.Data.2.json');
        }
    });

    await browser.close();
})();
