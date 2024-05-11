// const puppeteer = require('puppeteer');

// async function extractAirsoftBusinessDetails(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     const data = await page.evaluate(() => {
//         const name = document.querySelector('.FieldName')?.textContent.trim();
//         const addressParagraph = document.querySelector('.AirsoftBusinessListing > p');
//         const address = addressParagraph ? addressParagraph.innerText.split('\n').slice(1, 3).join(', ') : null;
//         const phone = document.querySelector('.AirsoftBusinessListing a[href^="tel:"]')?.textContent.trim();
//         const website = document.querySelector('.AirsoftBusinessListing a[href^="http:"]')?.href;
//         const facebook = document.querySelector('.AirsoftBusinessListing a[href*="facebook"]')?.href;

//         return {
//             name,
//             address,
//             phone,
//             website,
//             facebook
//         };
//     });

//     await browser.close();
//     return data;
// }

// (async () => {
//     const url = 'https://www.airsoftnut.com/mt-doom-paintball-and-airsoft/';
//     const details = await extractAirsoftBusinessDetails(url);
//     console.log(details);
// })();


const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAirsoftBusinessDetails(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const name = document.querySelector('.FieldName')?.textContent.trim();
        const addressParagraph = document.querySelector('.AirsoftBusinessListing > p');
        const address = addressParagraph ? addressParagraph.innerText.split('\n').slice(1, 3).join(', ') : null;
        const phone = document.querySelector('.AirsoftBusinessListing a[href^="tel:"]')?.textContent.trim();
        const website = document.querySelector('.AirsoftBusinessListing a[href^="http:"]')?.href;
        const facebook = document.querySelector('.AirsoftBusinessListing a[href*="facebook"]')?.href;

        return {
            name,
            address,
            phone,
            website,
            facebook
        };
    });

    await browser.close();
    return data;
}

async function runExtractionFromFile(inputFile, outputFile) {
    try {
        const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
        const allData = [];

        for (const url of urls) {
            console.log(`Extracting data from ${url}`);
            const details = await extractAirsoftBusinessDetails(url);
            allData.push(details);
        }

        fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
        console.log(`Data has been written to ${outputFile} successfully.`);
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputUrlsFile = '2_place_links.txt';
const outputJsonFile = 'extracted_data.json';
runExtractionFromFile(inputUrlsFile, outputJsonFile);
