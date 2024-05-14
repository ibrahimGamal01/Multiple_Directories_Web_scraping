// const puppeteer = require('puppeteer');

// async function extractClimbingDirectoryData(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);

//     const data = await page.evaluate(() => {
//         const name = document.querySelector('.gt3_lst_left_part h1')?.textContent.trim();
//         const logoLink = document.querySelector('.listing_single_top.gt3_js_bg_img')?.getAttribute('data-src');
//         const address = document.querySelector('.gt3_lst_meta span:nth-child(1)')?.textContent.trim();
//         const email = document.querySelector('.gt3_lst_meta span:nth-child(3) a')?.textContent.trim();
//         const phone = document.querySelector('.gt3_lst_meta span:nth-child(2) a')?.textContent.trim();

//         return { name, logoLink, address, email, phone };
//     });

//     await browser.close();
//     return data;
// }

// const url = 'https://theclimbingdirectory.co.uk/listings/8-bermuda-road-ipswich-ip3-9ru-uk-avid-climbing/';
// extractClimbingDirectoryData(url)
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));


// !

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function extractClimbingDirectoryData(url, retryCount = 3) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//         const data = await page.evaluate(() => {
//             const name = document.querySelector('.gt3_lst_left_part h1')?.textContent.trim();
//             const logoLink = document.querySelector('.listing_single_top.gt3_js_bg_img')?.getAttribute('data-src');
//             const address = document.querySelector('.gt3_lst_meta span:nth-child(1)')?.textContent.trim();
//             const email = document.querySelector('.gt3_lst_meta span:nth-child(3) a')?.textContent.trim();
//             const phone = document.querySelector('.gt3_lst_meta span:nth-child(2) a')?.textContent.trim();

//             return { name, logoLink, address, email, phone };
//         });

//         await browser.close();
//         return data;
//     } catch (error) {
//         console.error('Error during extraction:', error);

//         if (retryCount > 0) {
//             console.log(`Retrying ${retryCount} more times for URL: ${url}`);
//             await page.close();
//             await browser.close();
//             return extractClimbingDirectoryData(url, retryCount - 1);
//         } else {
//             console.log(`Failed to extract data after retries for URL: ${url}`);
//             await browser.close();
//             return null;
//         }
//     }
// }

// async function extractDataFromFile(file) {
//     try {
//         const urls = fs.readFileSync(file, 'utf8').split('\n').map(url => url.trim()).filter(url => url);
//         const extractedData = [];

//         for (const url of urls) {
//             console.log(`Processing URL: ${url}`);
//             const data = await extractClimbingDirectoryData(url);
//             if (data) {
//                 extractedData.push(data);
//             } else {
//                 console.log(`Skipping invalid URL: ${url}`);
//             }
//         }

//         return extractedData;
//     } catch (error) {
//         console.error('Error during file processing:', error);
//         return null;
//     }
// }

// const inputFile = 'links.txt';
// const outputFile = '27.data.json';

// extractDataFromFile(inputFile)
//     .then(data => {
//         if (data && data.length > 0) {
//             fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
//             console.log(`Extraction completed. Data saved to ${outputFile}`);
//         } else {
//             console.log('No valid data extracted.');
//         }
//     })
//     .catch(error => console.error('Error:', error));



const puppeteer = require('puppeteer');
const fs = require('fs');

const MAX_RETRIES = 3;
const WAIT_SETTINGS = { waitUntil: 'networkidle2', timeout: 90000 };
const INPUT_FILE = 'links.txt';
const OUTPUT_FILE = '27.data.json';

async function extractClimbingDirectoryData(page, url, retryCount = MAX_RETRIES) {
    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, WAIT_SETTINGS);

        const data = await page.evaluate(() => {
            const name = document.querySelector('.gt3_lst_left_part h1')?.textContent.trim();
            const logoLink = document.querySelector('.listing_single_top.gt3_js_bg_img')?.getAttribute('data-src');
            const address = document.querySelector('.gt3_lst_meta span:nth-child(1)')?.textContent.trim();
            const email = document.querySelector('.gt3_lst_meta span:nth-child(3) a')?.textContent.trim();
            const phone = document.querySelector('.gt3_lst_meta span:nth-child(2) a')?.textContent.trim();
            return { name, logoLink, address, email, phone };
        });

        return data;
    } catch (error) {
        console.error(`Error during extraction for URL ${url}:`, error.message);
        if (retryCount > 0) {
            console.log(`Retrying... Attempts left: ${retryCount}`);
            return extractClimbingDirectoryData(page, url, retryCount - 1);
        }
        return null;
    }
}

async function extractDataFromFile(file) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').map(url => url.trim()).filter(Boolean);
        const results = [];
        for (const url of urls) {
            const data = await extractClimbingDirectoryData(page, url);
            if (data) {
                results.push(data);
            } else {
                console.log(`No data extracted for ${url}`);
            }
        }
        return results;
    } catch (error) {
        console.error('Error during file processing:', error);
        return [];
    } finally {
        await page.close();
        await browser.close();
    }
}

async function runExtraction() {
    const data = await extractDataFromFile(INPUT_FILE);
    if (data.length > 0) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
        console.log(`Extraction completed. Data saved to ${OUTPUT_FILE}`);
    } else {
        console.log('No valid data extracted.');
    }
}

runExtraction().catch(error => console.error('Extraction failed:', error));
