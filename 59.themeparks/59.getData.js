// const puppeteer = require('puppeteer');
// const fs = require('fs').promises;

// async function scrapeDetails(urls) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     const detailedData = [];

//     for (let url of urls) {
//         await page.goto(url.link); // Go to the park's detailed page
//         const details = await page.evaluate(() => {
//             const title = document.querySelector('.itemTitle') ? document.querySelector('.itemTitle').innerText : null;
//             const image = document.querySelector('.itemImage img') ? document.querySelector('.itemImage img').src : null;
//             const introText = document.querySelector('.itemIntroText p') ? document.querySelector('.itemIntroText p').innerText : null;
//             const mapLink = document.querySelector('.itemFullText iframe') ? document.querySelector('.itemFullText iframe').src : null;

//             return {
//                 title,
//                 image,
//                 introText,
//                 mapLink
//             };
//         });

//         detailedData.push({
//             ...url,
//             details
//         });
//     }

//     await browser.close();
//     return detailedData;
// }

// async function readAndScrape() {
//     try {
//         const data = await fs.readFile('theme_parks.json', 'utf8');
//         const urls = JSON.parse(data);
//         const detailedData = await scrapeDetails(urls);
//         await fs.writeFile('theme_parks_details.json', JSON.stringify(detailedData, null, 2));
//         console.log('Detailed data has been written to theme_parks_details.json');
//     } catch (error) {
//         console.error('Failed to read or scrape data:', error);
//     }
// }

// readAndScrape();


const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeDetails(urls) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const detailedData = [];

    for (let url of urls) {
        try {
            await page.goto(url.link, { waitUntil: 'networkidle0', timeout: 60000 }); // Extended timeout to 60 seconds
            const details = await page.evaluate(() => {
                const title = document.querySelector('.itemTitle') ? document.querySelector('.itemTitle').innerText : null;
                const image = document.querySelector('.itemImage img') ? document.querySelector('.itemImage img').src : null;
                const introText = document.querySelector('.itemIntroText p') ? document.querySelector('.itemIntroText p').innerText : null;
                const mapLink = document.querySelector('.itemFullText iframe') ? document.querySelector('.itemFullText iframe').src : null;

                return {
                    title,
                    image,
                    introText,
                    mapLink
                };
            });

            detailedData.push({
                ...url,
                details
            });
        } catch (error) {
            console.error(`Failed to load ${url.link}, error: ${error}`);
            detailedData.push({
                ...url,
                error: `Failed to load, error: ${error.message}`
            });
        }
    }

    await browser.close();
    return detailedData;
}

async function readAndScrape() {
    try {
        const data = await fs.readFile('theme_parks.json', 'utf8');
        const urls = JSON.parse(data);
        const detailedData = await scrapeDetails(urls);
        await fs.writeFile('theme_parks_details.json', JSON.stringify(detailedData, null, 2));
        console.log('Detailed data has been written to theme_parks_details.json');
    } catch (error) {
        console.error('Failed to read or scrape data:', error);
    }
}

readAndScrape();
