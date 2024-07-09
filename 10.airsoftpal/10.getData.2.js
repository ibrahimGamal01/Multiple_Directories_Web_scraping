const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAirsoftFields(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
        const fields = [];
        const entries = document.querySelectorAll('h2, p');

        for (let i = 0; i < entries.length; i++) {
            if (entries[i].textContent.trim().startsWith('Address')) {
                const nameElement = entries[i - 1];
                const addressElement = entries[i];
                const websiteElement = entries[i + 1];

                const name = nameElement ? nameElement.textContent.trim() : null;
                const address = addressElement ? addressElement.querySelector('span').textContent.trim() : null;
                const website = websiteElement ? websiteElement.querySelector('a')?.href : null;

                if (name && address && website) {
                    fields.push({ name, address, website });
                }
            }
        }

        return fields;
    });

    await browser.close();
    return data;
}

async function saveDataToFile(data) {
    try {
        const dataString = JSON.stringify(data, null, 2);
        await fs.promises.writeFile('10.Data.2.json', dataString);
        console.log('Data saved to 10.Data.2.json');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function scrapeAndSaveData(url) {
    const retryLimit = 3;
    let retryCount = 0;
    let airsoftFieldsData = [];

    while (retryCount < retryLimit) {
        try {
            airsoftFieldsData = await extractAirsoftFields(url);
            await saveDataToFile(airsoftFieldsData);
            break;
        } catch (error) {
            console.error(`Error during attempt ${retryCount + 1}:`, error);
            retryCount++;
        }
    }

    if (retryCount === retryLimit) {
        console.log('Max retries reached. Exiting.');
    }
}

// Usage
const url = 'https://airsoftpal.com/airsoft-fields-united-states/';
scrapeAndSaveData(url);
