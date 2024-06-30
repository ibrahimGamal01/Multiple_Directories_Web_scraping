// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeClimbingGyms(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log(`Navigating to URL: ${url}`);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 600000 });

//         const data = await page.evaluate(() => {
//             const gyms = Array.from(document.querySelectorAll('tbody tr')).map(gym => {
//                 const name = gym.querySelector('.wpgmza_table_title')?.innerText || null;
//                 const address = gym.querySelector('.wpgmza_table_address')?.innerText || null;
//                 const description = gym.querySelector('.wpgmza_table_description')?.innerText || null;
//                 const openHours = gym.querySelector('.wpgmza_table_description strong:first-of-type')?.nextSibling.nodeValue || null;
//                 const phone = gym.querySelector('.wpgmza_table_description strong:last-of-type')?.nextSibling.nodeValue || null;
//                 const extraLink = gym.querySelector('.wpgmza_table_link a')?.href || null;

//                 return { name, address, description, openHours, phone, extraLink };
//             });

//             return gyms;
//         });

//         console.log('Scraped Data:', data);
//         return data;
//     } catch (error) {
//         console.error(`Error scraping URL ${url}:`, error);
//         return null;
//     } finally {
//         await browser.close();
//     }
// }

// async function runScraping() {
//     const url = 'https://climbodachi.com/climbing-gyms-directory/singapore/';
//     const outputFile = 'climbingGymsData.json';

//     const data = await scrapeClimbingGyms(url);
//     if (data) {
//         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
//         console.log(`Scraping completed. Data saved to ${outputFile}`);
//     } else {
//         console.log('Scraping failed.');
//     }
// }

// // Example usage
// runScraping().catch(error => console.error('Error:', error));

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeClimbingGyms(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to URL:', url);
//         await page.goto(url);

//         // Wait for the select dropdown to load
//         await page.waitForSelector('select[name="wpgmza_table_6_length"]');

//         // Change the dropdown value to "All" to display all entries
//         await page.select('select[name="wpgmza_table_6_length"]', '-1');

//         // Wait for the table content to load
//         await page.waitForSelector('.wpgmaps_mlist_row');

//         // Extract data from the table
//         const data = await page.evaluate(() => {
//             const rows = Array.from(document.querySelectorAll('.wpgmaps_mlist_row'));
//             return rows.map(row => {
//                 const title = row.querySelector('.wpgmza_table_title').textContent.trim();
//                 const address = row.querySelector('.wpgmza_table_address').textContent.trim();
//                 const description = row.querySelector('.wpgmza_table_description').textContent.trim();
//                 const link = row.querySelector('.wpgmza_table_link a').href;
//                 return { title, address, description, link };
//             });
//         });

//         return data;
//     } catch (error) {
//         console.error('Error during scraping:', error);
//         return null;
//     } finally {
//         await browser.close();
//     }
// }

// const url = 'https://climbodachi.com/climbing-gyms-directory/malaysia/';
// const outputFile = 'climbing_gyms_data.json';

// scrapeClimbingGyms(url)
//     .then(data => {
//         if (data && data.length > 0) {
//             fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
//             console.log(`Scraping completed. Data saved to ${outputFile}`);
//         } else {
//             console.log('No data scraped.');
//         }
//     })
//     .catch(error => console.error('Error:', error));




// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeClimbingGyms(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log(`Navigating to URL: ${url}`);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 900000 });

//         // Set the dropdown value to "-1" to load all entries
//         await page.evaluate(() => {
//             document.querySelector('select[name="wpgmza_table_6_length"]').value = "-1";
//             document.querySelector('select[name="wpgmza_table_6_length"]').dispatchEvent(new Event('change'));
//         });

//         // Wait for a bit after changing dropdown value
//         await page.evaluate(() => {
//             return new Promise(resolve => {
//                 setTimeout(resolve, 3000);
//             });
//         });

//         const data = await page.evaluate(() => {
//             const gyms = Array.from(document.querySelectorAll('tbody tr')).map(gym => {
//                 const name = gym.querySelector('.wpgmza_table_title')?.innerText || null;
//                 const address = gym.querySelector('.wpgmza_table_address')?.innerText || null;
//                 const description = gym.querySelector('.wpgmza_table_description')?.innerText || null;
//                 const openHours = gym.querySelector('.wpgmza_table_description strong:first-of-type')?.nextSibling.nodeValue || null;
//                 const phone = gym.querySelector('.wpgmza_table_description strong:last-of-type')?.nextSibling.nodeValue || null;
//                 const extraLink = gym.querySelector('.wpgmza_table_link a')?.href || null;

//                 return { name, address, description, openHours, phone, extraLink };
//             });

//             return gyms;
//         });

//         console.log('Scraped Data:', data);
//         return data;
//     } catch (error) {
//         console.error(`Error scraping URL ${url}:`, error);
//         return null;
//     } finally {
//         await browser.close();
//     }
// }

// async function runScraping() {
//     const url = 'https://climbodachi.com/climbing-gyms-directory/singapore/';
//     const outputFile = 'climbingGymsData.json';

//     const data = await scrapeClimbingGyms(url);
//     if (data) {
//         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
//         console.log(`Scraping completed. Data saved to ${outputFile}`);
//     } else {
//         console.log('Scraping failed.');
//     }
// }

// runScraping().catch(error => console.error('Error:', error));


const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeClimbingGyms(url, retries = 3) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 600000 });

        const data = await page.evaluate(() => {
            const gyms = Array.from(document.querySelectorAll('tbody tr')).map(gym => {
                try {
                    const name = gym.querySelector('.wpgmza_table_title')?.innerText?.trim() || null;
                    const address = gym.querySelector('.wpgmza_table_address')?.innerText?.trim() || null;
                    const description = gym.querySelector('.wpgmza_table_description')?.innerText?.trim() || null;
                    const openHours = gym.querySelector('.wpgmza_table_description strong:first-of-type')?.nextSibling?.nodeValue?.trim() || null;
                    const phone = gym.querySelector('.wpgmza_table_description strong:last-of-type')?.nextSibling?.nodeValue?.trim() || null;
                    const extraLink = gym.querySelector('.wpgmza_table_link a')?.href?.trim() || null;

                    // Set phone to null if it contains invalid characters
                    const cleanedPhone = phone ? phone.replace(/[^\d+]/g, '') : null;
                    if (cleanedPhone !== phone) {
                        phone = null;
                    }

                    return { name, address, description, openHours, phone, extraLink };
                } catch (e) {
                    console.error('Error processing a gym element:', e);
                    return null;
                }
            }).filter(gym => gym !== null); // Remove null entries if any gym elements failed

            return gyms;
        });

        console.log('Scraped Data:', data);
        return data;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            return scrapeClimbingGyms(url, retries - 1);
        } else {
            return null;
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function runScraping() {
    const url = 'https://climbodachi.com/climbing-gyms-directory/thailand/';
    const outputFile = 'climbingGymsData.json';

    const data = await scrapeClimbingGyms(url);
    if (data) {
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Scraping completed. Data saved to ${outputFile}`);
    } else {
        console.log('Scraping failed.');
    }
}

// Example usage
runScraping().catch(error => console.error('Error:', error));
