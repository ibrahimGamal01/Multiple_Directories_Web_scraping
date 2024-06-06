// const puppeteer = require('puppeteer');
// const fs = require('fs').promises;
// const { parse } = require('json2csv');

// async function scrapeUnitInfo(url, name) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     let data = null;

//     try {
//         await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//         data = await page.evaluate((name) => {
//             const nameValue = name;
//             const website = document.querySelector('#unit_website')?.href;
//             const contactInfos = Array.from(document.querySelectorAll('.contact_info'));

//             let address = '';
//             let addressUrl = '';
//             let email = '';
//             let phone = '';
//             let website2 = '';

//             contactInfos.forEach(contactInfo => {
//                 const label = contactInfo.querySelector('.contact_label')?.textContent.trim();
//                 const value = contactInfo.querySelector('.contact_value')?.textContent.trim();
//                 const anchor = contactInfo.querySelector('.contact_value a');

//                 if (label === 'Address') {
//                     address = value;
//                     addressUrl = anchor?.href;
//                 } else if (label === 'Email') {
//                     email = value;
//                 } else if (label === 'Phone') {
//                     phone = value;
//                 } else if (label === 'Website') {
//                     website2 = value;
//                 }
//             });

//             const hoursOfOperation = Array.from(document.querySelectorAll('#hours_of_operation .hoursofop')).map(item => {
//                 const day = item.querySelector('.hoursofop_day')?.textContent.trim();
//                 const time = item.querySelector('.hoursofof_time')?.textContent.trim();
//                 return { day, time };
//             });

//             return {
//                 name: nameValue,
//                 website,
//                 address,
//                 addressUrl,
//                 email,
//                 phone,
//                 website2,
//                 hoursOfOperation
//             };
//         }, name);
//     } catch (error) {
//         console.error(`Error while fetching data from ${url}:`, error);
//     } finally {
//         await browser.close();
//     }

//     return data;
// }

// async function scrapeLinksFromFile(filePath) {
//     try {
//         const linksData = await fs.readFile(filePath, 'utf-8');
//         const linksByState = JSON.parse(linksData);

//         const scrapedData = [];

//         for (const state in linksByState) {
//             const links = linksByState[state];
//             console.log(`Scraping links for ${state}`);
//             for (const link of links) {
//                 let retries = 3;

//                 while (retries > 0) {
//                     try {
//                         const name = link.split('/').pop(); // Extract name from URL
//                         const data = await scrapeUnitInfo(link, name);
//                         if (data) {
//                             scrapedData.push(data);
//                             console.log(`${name}:`, data); // Log using unit name
//                             break;
//                         } else {
//                             console.log('Failed to scrape:', name);
//                             retries--;
//                         }
//                     } catch (error) {
//                         console.error('Error during scraping:', error);
//                         retries--;
//                     }
//                 }

//                 if (retries === 0) {
//                     console.log('Max retries reached for:', link.split('/').pop());
//                 }
//             }
//         }

//         // Save scraped data as JSON
//         const jsonOutputFilePath = '05.Data.json';
//         await fs.writeFile(jsonOutputFilePath, JSON.stringify(scrapedData, null, 2));
//         console.log(`Scraped data saved to ${jsonOutputFilePath}`);

//         // Convert scraped data to CSV and save
//         const csvOutputFilePath = 'scrapedData.csv';
//         const csv = parse(scrapedData);
//         await fs.writeFile(csvOutputFilePath, csv);
//         console.log(`Scraped data saved to ${csvOutputFilePath}`);
//     } catch (error) {
//         console.error('Error reading file or writing data:', error);
//     }
// }

// const filePath = 'linksByState.json';
// scrapeLinksFromFile(filePath);


const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const { parse } = require('json2csv');

async function scrapeUnitInfo(url, name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let data = null;

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        data = await page.evaluate((name) => {
            const nameValue = name;
            const website = document.querySelector('#unit_website')?.href;
            const contactInfos = Array.from(document.querySelectorAll('.contact_info'));

            let address = '';
            let addressUrl = '';
            let email = '';
            let phone = '';
            let website2 = '';

            contactInfos.forEach(contactInfo => {
                const label = contactInfo.querySelector('.contact_label')?.textContent.trim();
                const value = contactInfo.querySelector('.contact_value')?.textContent.trim();
                const anchor = contactInfo.querySelector('.contact_value a');

                if (label === 'Address') {
                    address = value;
                    addressUrl = anchor?.href;
                } else if (label === 'Email') {
                    email = value;
                } else if (label === 'Phone') {
                    phone = value;
                } else if (label === 'Website') {
                    website2 = value;
                }
            });

            const hoursOfOperation = Array.from(document.querySelectorAll('#hours_of_operation .hoursofop')).map(item => {
                const day = item.querySelector('.hoursofop_day')?.textContent.trim();
                const time = item.querySelector('.hoursofof_time')?.textContent.trim();
                return { day, time };
            });

            return {
                name: nameValue,
                website,
                address,
                addressUrl,
                email,
                phone,
                website2,
                hoursOfOperation
            };
        }, name);
    } catch (error) {
        console.error(`Error while fetching data from ${url}:`, error);
    } finally {
        await browser.close();
    }

    return data;
}

async function scrapeLinksFromFile(filePath) {
    try {
        const linksData = await fs.readFile(filePath, 'utf-8');
        const linksByState = JSON.parse(linksData);

        const scrapedData = [];
        const skippedLinks = [];

        for (const state in linksByState) {
            const links = linksByState[state];
            console.log(`Scraping links for ${state}`);
            for (const link of links) {
                let retries = 3;
                let success = false;

                while (retries > 0 && !success) {
                    try {
                        const name = link.split('/').pop(); // Extract name from URL
                        const data = await scrapeUnitInfo(link, name);
                        if (data) {
                            scrapedData.push(data);
                            console.log(`${name}:`, data); // Log using unit name
                            success = true;
                        } else {
                            console.log('Failed to scrape:', name);
                            retries--;
                        }
                    } catch (error) {
                        console.error('Error during scraping:', error);
                        retries--;
                    }
                }

                if (!success) {
                    const name = link.split('/').pop();
                    skippedLinks.push(link);
                    console.log('Max retries reached for:', name);
                }
            }
        }

        // Save scraped data as JSON
        const jsonOutputFilePath = '05.Data.json';
        await fs.writeFile(jsonOutputFilePath, JSON.stringify(scrapedData, null, 2));
        console.log(`Scraped data saved to ${jsonOutputFilePath}`);

        // Save skipped links as JSON
        const skippedLinksFilePath = '05.skippedLinks.json';
        await fs.writeFile(skippedLinksFilePath, JSON.stringify(skippedLinks, null, 2));
        console.log(`Skipped links saved to ${skippedLinksFilePath}`);

        // Convert scraped data to CSV and save
        const csvOutputFilePath = '05.Data.csv';
        const csv = parse(scrapedData);
        await fs.writeFile(csvOutputFilePath, csv);
        console.log(`Scraped data saved to ${csvOutputFilePath}`);
    } catch (error) {
        console.error('Error reading file or writing data:', error);
    }
}

const filePath = 'linksByState.json';
scrapeLinksFromFile(filePath);
