const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeUnitInfo(url, name) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate((name) => {
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

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return null;
    }
}

async function scrapeLinksFromFile(filePath) {
    try {
        const linksData = await fs.readFile(filePath, 'utf-8');
        const linksByState = JSON.parse(linksData);

        const scrapedData = [];

        for (const state in linksByState) {
            const links = linksByState[state];
            console.log(`Scraping links for ${state}`);
            for (const link of links) {
                let retries = 3;
                let data = null;

                while (retries > 0) {
                    try {
                        const name = link.split('/').pop(); // Extract name from URL
                        data = await scrapeUnitInfo(link, name);
                        if (data) {
                            scrapedData.push(data);
                            console.log(`${name}:`, data); // Log using unit name
                            break;
                        } else {
                            console.log('Failed to scrape:', name);
                            retries--;
                        }
                    } catch (error) {
                        console.error('Error during scraping:', error);
                        retries--;
                    }
                }

                if (retries === 0) {
                    console.log('Max retries reached for:', name);
                }
            }
        }

        const outputFilePath = 'scrapedData.json';
        await fs.writeFile(outputFilePath, JSON.stringify(scrapedData, null, 2));
        console.log(`Scraped data saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error reading file or writing data:', error);
    }
}

const filePath = 'linksByState.json';
scrapeLinksFromFile(filePath);



// ! ---------------------------- Try 02 for errors ----------------------------

// const puppeteer = require('puppeteer');
// const fs = require('fs').promises;

// async function scrapeUnitInfo(url, name) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         const data = await page.evaluate((name) => {
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

//         await browser.close();
//         return data;
//     } catch (error) {
//         console.error('Error during scraping:', error);
//         await browser.close();
//         return null;
//     }
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
//                 let data = null;

//                 while (retries > 0) {
//                     try {
//                         const name = link.split('/').pop(); // Extract name from URL
//                         data = await scrapeUnitInfo(link, name);
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
//                     console.log('Max retries reached for:', name);
//                 }
//             }
//         }

//         const outputFilePath = 'scrapedData.json';
//         await fs.writeFile(outputFilePath, JSON.stringify(scrapedData, null, 2));
//         console.log(`Scraped data saved to ${outputFilePath}`);
//     } catch (error) {
//         console.error('Error reading file or writing data:', error);
//     }
// }

// const filePath = 'linksByState.json';
// scrapeLinksFromFile(filePath);
