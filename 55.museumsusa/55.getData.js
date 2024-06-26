// const puppeteer = require('puppeteer');
// const fs = require('fs');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     const data = [];

//     for (let id = 1; id <= 18000; id++) {
//         const url = `https://www.museumsusa.org/museums/info/${id}`;
//         console.log('Scraping:', url);

//         try {
//             await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//             const museumData = await page.evaluate(() => {
//                 const getTextContent = (selector) => document.querySelector(selector)?.textContent.trim() || null;
//                 const getHref = (selector) => document.querySelector(selector)?.href.trim() || null;
//                 const getAllHrefs = (selector) => Array.from(document.querySelectorAll(selector)).map(element => element.href.trim());

//                 const name = getTextContent('#ctl04_ctl00_orgName a');
//                 const streetAddress = getTextContent('#ctl04_ctl00_icStreetAddress');
//                 const mailingAddress = getTextContent('#ctl04_ctl00_icMailingAddress');
//                 const phone = getTextContent('#ctl04_ctl00_icPhoneEmailWeb .phone');
//                 const website = getHref('#ctl04_ctl00_icPhoneEmailWeb a');
//                 const socialLinks = {
//                     facebook: getHref('a[title="Facebook"]'),
//                     twitter: getHref('a[title="Twitter"]'),
//                     instagram: getHref('a[title="Instagram"]'),
//                     linkedin: getHref('a[title="LinkedIn"]'),
//                     youtube: getHref('a[title="YouTube"]'),
//                 };
//                 const hours = getTextContent('#ctl04_ctl00_ecHours .ui.grid .ui.row:nth-child(2)');
//                 const museumTypes = Array.from(document.querySelectorAll('#ctl04_ctl00_dlCategories a')).map(el => el.textContent.trim());

//                 return {
//                     name,
//                     address: {
//                         streetAddress,
//                         mailingAddress,
//                     },
//                     phone,
//                     website,
//                     socialLinks,
//                     hours,
//                     museumTypes,
//                 };
//             });

//             if (museumData.name) {
//                 data.push(museumData);
//             }
//         } catch (error) {
//             console.error(`Error scraping ${url}:`, error.message);
//         }
//     }

//     fs.writeFileSync('museums_data.json', JSON.stringify(data, null, 2), (err) => {
//         if (err) {
//             console.error('Error writing file:', err);
//         } else {
//             console.log('Data successfully written to museums_data.json');
//         }
//     });

//     await browser.close();
// })();



//  ---------------------------------------------------------------------------------------------------
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const data = [];

    const maxRetries = 3;
    const batchSize = 100; // Process 100 URLs at a time

    for (let startId = 1; startId <= 18000; startId += batchSize) {
        const endId = Math.min(startId + batchSize - 1, 18000);
        console.log(`Processing batch: ${startId} to ${endId}`);

        for (let id = startId; id <= endId; id++) {
            const url = `https://www.museumsusa.org/museums/info/${id}`;
            console.log('Scraping:', url);

            let success = false;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

                    const museumData = await page.evaluate(() => {
                        const getTextContent = (selector) => document.querySelector(selector)?.textContent.trim() || null;
                        const getHref = (selector) => document.querySelector(selector)?.href.trim() || null;

                        const name = getTextContent('#ctl04_ctl00_orgName a');
                        const streetAddress = getTextContent('#ctl04_ctl00_icStreetAddress');
                        const mailingAddress = getTextContent('#ctl04_ctl00_icMailingAddress');
                        const phone = getTextContent('#ctl04_ctl00_icPhoneEmailWeb .phone');
                        const website = getHref('#ctl04_ctl00_icPhoneEmailWeb a');
                        const socialLinks = {
                            facebook: getHref('a[title="Facebook"]'),
                            twitter: getHref('a[title="Twitter"]'),
                            instagram: getHref('a[title="Instagram"]'),
                            linkedin: getHref('a[title="LinkedIn"]'),
                            youtube: getHref('a[title="YouTube"]'),
                        };
                        const hours = getTextContent('#ctl04_ctl00_ecHours .ui.grid .ui.row:nth-child(2)');
                        const museumTypes = Array.from(document.querySelectorAll('#ctl04_ctl00_dlCategories a')).map(el => el.textContent.trim());

                        return {
                            name,
                            address: {
                                streetAddress,
                                mailingAddress,
                            },
                            phone,
                            website,
                            socialLinks,
                            hours,
                            museumTypes,
                        };
                    });

                    if (museumData.name) {
                        data.push(museumData);
                    }
                    success = true;
                    break; // Break the retry loop on success
                } catch (error) {
                    console.error(`Error scraping ${url} (attempt ${attempt + 1}):`, error.message);
                    if (attempt === maxRetries - 1) {
                        console.error(`Failed to scrape ${url} after ${maxRetries} attempts.`);
                    }
                }
            }
        }
    }

    fs.writeFileSync('museums_data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to museums_data.json');
        }
    });

    await browser.close();
})();
