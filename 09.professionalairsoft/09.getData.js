const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAirsoftFields(url) {
    const browser = await puppeteer.launch({ headless: true }); // Launch Puppeteer in headless mode
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' }); // Wait for DOM content to be loaded

        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.wikitable tbody tr')).slice(1); // Skip the header row
            const fields = rows.map(row => {
                const columns = Array.from(row.querySelectorAll('td'));
                const name = columns[0]?.textContent.trim() || null;
                const location = columns[1]?.textContent.trim() || null;
                const type = columns[2]?.textContent.trim() || null;
                const website = columns[5]?.querySelector('a')?.href || null;

                return {
                    name,
                    state: location,
                    type,
                    website
                };
            });
            return fields;
        });

        await browser.close();
        return data;

    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function saveDataToFile(data) {
    try {
        const dataString = JSON.stringify(data, null, 2);
        await fs.promises.writeFile('09.Data.json', dataString);
        console.log('Data saved to 09.Data.json');
    } catch (error) {
        console.error('Error saving data:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function scrapeAndSaveData(url) {
    const retryLimit = 3; // Number of retry attempts
    let retryCount = 0;
    let airsoftFieldsData = [];

    while (retryCount < retryLimit) {
        try {
            airsoftFieldsData = await extractAirsoftFields(url);
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
const url = 'https://professionalairsoft.fandom.com/wiki/List_of_airsoft_fields_in_the_United_States';
scrapeAndSaveData(url);
