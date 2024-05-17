// ! PoC
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeArenaData(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//         // Wait for the elements containing the data to load
//         await page.waitForSelector('.jet-listing-grid__item', { visible: true });

//         const data = await page.evaluate(() => {
//             const arenaElements = document.querySelectorAll('.jet-listing-grid__item');

//             const results = Array.from(arenaElements).map(arena => {
//                 const getName = () => {
//                     const nameElement = arena.querySelector('.jet-listing-dynamic-link__link');
//                     return nameElement ? nameElement.innerText.trim() : '';
//                 };

//                 const getAddress = () => {
//                     const addressElement = arena.querySelector('.elementor-icon-list-text');
//                     return addressElement ? addressElement.innerText.trim() : '';
//                 };

//                 const getWebsite = () => {
//                     const websiteElement = arena.querySelector('.elementor-icon-list-item a');
//                     return websiteElement ? websiteElement.href : '';
//                 };

//                 return {
//                     Name: getName(),
//                     Address: getAddress(),
//                     Website: getWebsite()
//                 };
//             });

//             return results;
//         });

//         return data;

//     } catch (error) {
//         console.error('Error scraping arena data:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// }

// (async () => {
//     const url = 'https://arena-guide.com/locations/usa/';
//     const scrapedData = await scrapeArenaData(url);

//     // Save scraped data to a JSON file
//     fs.writeFileSync('68.Data.json', JSON.stringify(scrapedData, null, 2));
//     console.log('Scraped data saved to 68.Data.json');
// })();



// ! Full Code 

const fs = require('fs');
const puppeteer = require('puppeteer');

async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function scrapeArenaData(url, maxPages) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const allData = [];

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        for (let i = 0; i < maxPages; i++) {
            // Wait for the elements containing the data to load
            await page.waitForSelector('.jet-listing-grid__item', { visible: true });

            const data = await page.evaluate(() => {
                const arenaElements = document.querySelectorAll('.jet-listing-grid__item');

                const results = Array.from(arenaElements).map(arena => {
                    const getName = () => {
                        const nameElement = arena.querySelector('.jet-listing-dynamic-link__link');
                        return nameElement ? nameElement.innerText.trim() : '';
                    };

                    const getAddress = () => {
                        const addressElement = arena.querySelector('.elementor-icon-list-text');
                        return addressElement ? addressElement.innerText.trim() : '';
                    };

                    const getWebsite = () => {
                        const websiteElement = arena.querySelector('.elementor-icon-list-item a');
                        return websiteElement ? websiteElement.href : '';
                    };

                    return {
                        Name: getName(),
                        Address: getAddress(),
                        Website: getWebsite()
                    };
                });

                return results;
            });

            allData.push(...data);

            // Check if there is a next button and click it
            const nextButton = await page.$('.jet-filters-pagination__item.prev-next.next');
            if (nextButton) {
                console.log(`Navigating to page ${i} of ${maxPages}...`);
                await nextButton.click();
                await delay(5000); // Wait for 5 seconds to ensure the page is loaded
            } else {
                break; // If no next button is found, break the loop
            }
        }

    } catch (error) {
        console.error('Error scraping arena data:', error);
    } finally {
        await browser.close();
    }

    return allData;
}

(async () => {
    const url = 'https://arena-guide.com/locations/usa/';
    const maxPages = 88; // Number of pages to navigate

    const scrapedData = await scrapeArenaData(url, maxPages);

    // Save scraped data to a JSON file
    fs.writeFileSync('68.Data.json', JSON.stringify(scrapedData, null, 2));
    console.log('Scraped data saved to 68.Data.json');
})();
