const puppeteer = require('puppeteer');
const fs = require('fs');

const MAX_RETRIES = 3;
const WAIT_SETTINGS = { waitUntil: 'networkidle2', timeout: 90000 };
const INPUT_FILE = 'links.txt';
const OUTPUT_FILE = '27.data.json';

function cleanData(data) {
    const cleanedData = { ...data };
    
    // Check email
    if (cleanedData.email) {
        if (cleanedData.email.startsWith('https://') || !cleanedData.email.includes('@')) {
            cleanedData.website = cleanedData.email;
            cleanedData.email = null;
        }
    }

    // Check phone
    if (cleanedData.phone) {
        if (cleanedData.phone.includes('@')) {
            cleanedData.email = cleanedData.phone;
            cleanedData.phone = null;
        } else if (cleanedData.phone.includes('https://')) {
            cleanedData.website = cleanedData.phone;
            cleanedData.phone = null;
        }
    }

    return cleanedData;
}

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

        return cleanData(data);
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
