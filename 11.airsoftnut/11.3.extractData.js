const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAirsoftBusinessDetails(url, retryLimit = 3) {
    let browser;
    let attempt = 0;

    while (attempt < retryLimit) {
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            const data = await page.evaluate(() => {
                const name = document.querySelector('.FieldName')?.textContent.trim();
                const addressParagraph = document.querySelector('.AirsoftBusinessListing > p');
                const address = addressParagraph ? addressParagraph.innerText.split('\n').slice(1, 3).join(', ') : null;
                const phone = document.querySelector('.AirsoftBusinessListing a[href^="tel:"]')?.textContent.trim();
                const website = document.querySelector('.AirsoftBusinessListing a[href^="http:"]')?.href;
                const facebook = document.querySelector('.AirsoftBusinessListing a[href*="facebook"]')?.href;

                // Extract hours of operation
                const hoursParagraph = [...document.querySelectorAll('.AirsoftBusinessListing > p')].find(p => p.textContent.includes('Hours:'));
                const hours = hoursParagraph ? hoursParagraph.innerText.split('\n').slice(1).join(', ') : null;

                return {
                    name,
                    address,
                    phone,
                    website,
                    facebook,
                    hours
                };
            });

            await browser.close();
            return data;
        } catch (error) {
            if (browser) {
                await browser.close();
            }
            console.error(`Attempt ${attempt + 1} failed for ${url}:`, error);
            attempt++;
        }
    }

    throw new Error(`Failed to extract details from ${url} after ${retryLimit} attempts`);
}

async function runExtractionFromFile(inputFile, outputFile) {
    try {
        const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
        const allData = [];

        for (const url of urls) {
            console.log(`Extracting data from ${url}`);
            try {
                const details = await extractAirsoftBusinessDetails(url);
                allData.push(details);
            } catch (error) {
                console.error(`Failed to extract details from ${url}:`, error);
            }
        }

        fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
        console.log(`Data has been written to ${outputFile} successfully.`);
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputUrlsFile = '2_place_links.txt';
const outputJsonFile = '11.Data.json';
runExtractionFromFile(inputUrlsFile, outputJsonFile);
