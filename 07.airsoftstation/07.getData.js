const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAirsoftFields() {
    const browser = await puppeteer.launch({ headless: true }); // Launch Puppeteer in headless mode
    const page = await browser.newPage();

    try {
        await page.goto('https://www.airsoftstation.com/airsoft-fields-in-the-united-states/', {
            waitUntil: 'networkidle2', // Wait until there are no more than 2 network connections for 500 ms
            timeout: 0 // Set timeout to 0 for no timeout
        });

        const airsoftFieldsData = await page.evaluate(() => {
            const fieldElements = document.querySelectorAll('.CMS_MN > h3, .CMS_MN > p');

            const fields = [];
            let currentState = null;

            fieldElements.forEach(element => {
                if (element.tagName === 'H3') {
                    currentState = element.textContent.trim();
                } else if (element.tagName === 'P') {
                    const name = element.querySelector('a > span')?.textContent.trim();
                    const link = element.querySelector('a')?.href;
                    if (name && link) {
                        fields.push({
                            name,
                            link,
                            state: currentState
                        });
                    }
                }
            });

            return fields;
        });

        await browser.close();
        return airsoftFieldsData;

    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function saveDataToFile(data) {
    try {
        const dataString = JSON.stringify(data, null, 2);
        await fs.promises.writeFile('airsoft_fields.json', dataString);
        console.log('Data saved to airsoft_fields.json');
    } catch (error) {
        console.error('Error saving data:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function scrapeAndSaveData() {
    const retryLimit = 3; // Number of retry attempts
    let retryCount = 0;
    let airsoftFieldsData = [];

    while (retryCount < retryLimit) {
        try {
            airsoftFieldsData = await scrapeAirsoftFields();
            await saveDataToFile(airsoftFieldsData);
            break; // Exit the retry loop if successful
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
scrapeAndSaveData();
