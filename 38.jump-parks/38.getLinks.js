// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function extractLinksFromPage(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);

//     const links = await page.evaluate(() => {
//         const linkElements = document.querySelectorAll('article.location a.d-block');
//         const links = Array.from(linkElements).map(link => link.href);
//         return links;
//     });

//     await browser.close();
//     return links;
// }

// const url = 'https://jump-parks.com/parks/?country=CA';
// const outputFile = 'links.txt';

// extractLinksFromPage(url)
//     .then(links => {
//         fs.writeFileSync(outputFile, links.join('\n'));
//         console.log(`Links extracted and saved to ${outputFile}`);
//     })
//     .catch(error => console.error('Error:', error));


// Path: 38.jump-parks/38.getLinks.js

const puppeteer = require('puppeteer');
const fs = require('fs');

// List of 2-letter country codes
const countryCodes = [
    'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 
    'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 
    'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 
    'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 
    'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 
    'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 
    'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 
    'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 
    'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 
    'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 
    'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 
    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 
    'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 
    'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 
    'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW'
];

async function extractLinksFromPage(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('article.location a.d-block');
        const links = Array.from(linkElements).map(link => link.href);
        return links;
    });

    await browser.close();
    return links;
}

async function scrapeCountries() {
    const outputFile = 'links.txt';
    let allLinks = [];

    for (const countryCode of countryCodes) {
        const url = `https://jump-parks.com/parks/?country=${countryCode}`;
        try {
            console.log(`Scraping for country code: ${countryCode}`);
            const links = await extractLinksFromPage(url);
            allLinks = allLinks.concat(links);
            console.log(`Links extracted for country code ${countryCode}`);
        } catch (error) {
            console.error(`Error scraping for country code ${countryCode}:`, error);
        }
    }

    fs.writeFileSync(outputFile, allLinks.join('\n'));
    console.log(`All links extracted and saved to ${outputFile}`);
}

scrapeCountries().catch(error => console.error('Error:', error));
