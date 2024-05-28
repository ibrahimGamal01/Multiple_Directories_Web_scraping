// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function extractSkatingRinks(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

//         console.log('Extracting skating rink information...');

//         const data = await page.evaluate(() => {
//             const listings = Array.from(document.querySelectorAll('.ListingResults_All_CONTAINER'));
//             const skatingRinks = [];

//             listings.forEach(listing => {
//                 const nameElement = listing.querySelector('.ListingResults_All_ENTRYTITLELEFTBOX a');
//                 const addressElement = listing.querySelector('[itemprop="street-address"]');
//                 const localityElement = listing.querySelector('[itemprop="locality"]');
//                 const regionElement = listing.querySelector('[itemprop="region"]');
//                 const postalCodeElement = listing.querySelector('[itemprop="postal-code"]');
//                 const phoneElement = listing.querySelector('.ListingResults_Level3_PHONE1');
//                 const learnMoreElement = listing.querySelector('.ListingResults_Level3_LEARNMORE a');
//                 const socialMediaElements = listing.querySelectorAll('.ListingResults_Level3_SOCIALMEDIA a');

//                 if (nameElement && addressElement && phoneElement) {
//                     const name = nameElement.textContent.trim();
//                     const address = `${addressElement.textContent.trim()}, ${localityElement.textContent.trim()}, ${regionElement.textContent.trim()} ${postalCodeElement.textContent.trim()}`;
//                     const phone = phoneElement.textContent.trim().replace('Work Phone: ', '');
//                     const learnMoreLink = learnMoreElement ? learnMoreElement.href : '';
//                     const socialMediaLinks = Array.from(socialMediaElements).map(el => el.href);

//                     skatingRinks.push({
//                         name,
//                         address,
//                         phone,
//                         learnMoreLink,
//                         socialMediaLinks
//                     });
//                 }
//             });

//             return skatingRinks;
//         });

//         await browser.close();
//         return data;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         await browser.close();
//         throw error;
//     }
// }

// async function extractFromMultipleURLs(file) {
//     try {
//         const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
//         const results = [];

//         for (const url of urls) {
//             const data = await extractSkatingRinks(url);
//             results.push(...data); // Merge data into results array
//         }

//         return results;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         throw error;
//     }
// }

// const inputFile = '64.links.txt';
// extractFromMultipleURLs(inputFile)
//     .then(info => {
//         const outputFile = '64.Data.json';
//         fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
//         console.log('Data extracted and saved to', outputFile);
//     })
//     .catch(async (error) => {
//         console.error('Error:', error);
//     });


const fs = require('fs');
const puppeteer = require('puppeteer');

async function extractSkatingRinks(url, retryCount = 3) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

        console.log('Extracting skating rink information...');

        const data = await page.evaluate(() => {
            const listings = Array.from(document.querySelectorAll('.ListingResults_All_CONTAINER'));
            const skatingRinks = [];

            listings.forEach(listing => {
                const nameElement = listing.querySelector('.ListingResults_All_ENTRYTITLELEFTBOX a');
                const addressElement = listing.querySelector('[itemprop="street-address"]');
                const localityElement = listing.querySelector('[itemprop="locality"]');
                const regionElement = listing.querySelector('[itemprop="region"]');
                const postalCodeElement = listing.querySelector('[itemprop="postal-code"]');
                const phoneElement = listing.querySelector('.ListingResults_Level3_PHONE1');
                const learnMoreElement = listing.querySelector('.ListingResults_Level3_LEARNMORE a');
                const visitSiteElement = listing.querySelector('.ListingResults_Level3_VISITSITE a');
                const socialMediaElements = listing.querySelectorAll('.ListingResults_Level3_SOCIALMEDIA a');

                if (nameElement && addressElement && phoneElement) {
                    const name = nameElement.textContent.trim();
                    const address = `${addressElement.textContent.trim()}, ${localityElement.textContent.trim()}, ${regionElement.textContent.trim()} ${postalCodeElement.textContent.trim()}`;
                    const phone = phoneElement.textContent.trim().replace('Work Phone: ', '');
                    const learnMoreLink = learnMoreElement ? learnMoreElement.href : '';
                    const visitSiteLink = visitSiteElement ? visitSiteElement.href : '';
                    const socialMediaLinks = Array.from(socialMediaElements).map(el => el.href);

                    skatingRinks.push({
                        name,
                        address,
                        phone,
                        learnMoreLink,
                        visitSiteLink,
                        socialMediaLinks
                    });
                }
            });

            return skatingRinks;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error(`Error during extraction from ${url}:`, error);
        await browser.close();

        if (retryCount > 0) {
            console.log(`Retrying... (${retryCount} attempts left)`);
            return extractSkatingRinks(url, retryCount - 1);
        } else {
            console.error(`Failed to extract data from ${url} after multiple attempts.`);
            return [];
        }
    }
}

async function extractFromMultipleURLs(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        const results = [];

        for (const url of urls) {
            const data = await extractSkatingRinks(url);
            results.push(...data); // Merge data into results array
        }

        return results;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    }
}

const inputFile = '64.links.txt';
extractFromMultipleURLs(inputFile)
    .then(info => {
        const outputFile = '64.Data.json';
        fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
        console.log('Data extracted and saved to', outputFile);
    })
    .catch(error => {
        console.error('Error:', error);
    });
