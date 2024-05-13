// Path: 38.jump-parks/38.getData.js

// ? // ------------------- Poc Code -------------------

// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         const url = 'https://jump-parks.com/park/ae-bounce-abu-dhabi/';
//         await page.goto(url);

//         const data = await page.evaluate(() => {
//             const name = document.querySelector('header h1').textContent.trim();
//             const details = document.querySelector('header p').textContent.trim();
//             const openingHours = Array.from(document.querySelectorAll('.fs-6')).slice(0, 7).map(item => item.textContent.trim());
//             const phone = document.querySelector('.contact-link span').textContent.trim();
//             const link = document.querySelector('.contact-link + a').href;

//             return { name, details, openingHours, phone, link };
//         });

//         console.log(data);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         await browser.close();
//     }
// })();

// ? // ------------------- Full Code -------------------
const puppeteer = require('puppeteer');
const fs = require('fs');

const retryCount = 3; // Number of times to retry in case of failure

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const links = fs.readFileSync('links.txt', 'utf8').split('\n').filter(Boolean);

        const parkDataList = [];
        for (const link of links) {
            let retries = retryCount;
            while (retries > 0) {
                try {
                    await page.goto(link);

                    const data = await page.evaluate(() => {
                        const name = document.querySelector('header h1').textContent.trim();
                        const details = document.querySelector('header p').textContent.trim();
                        const openingHours = Array.from(document.querySelectorAll('.fs-6')).slice(0, 7).map(item => item.textContent.trim());
                        const phone = document.querySelector('.contact-link span').textContent.trim();
                        const link = document.querySelector('.contact-link + a').href;

                        return { name, details, openingHours, phone, link };
                    });

                    parkDataList.push(data);
                    console.log(`Scraped: ${link}`);
                    break; // Exit the retry loop if successful
                } catch (error) {
                    console.error(`Error scraping ${link}: ${error.message}`);
                    retries--; // Decrement retries
                }
            }
        }

        const outputFileName = 'park_data.json';
        fs.writeFileSync(outputFileName, JSON.stringify(parkDataList, null, 2));
        console.log(`Output saved to ${outputFileName}`);
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
})();
