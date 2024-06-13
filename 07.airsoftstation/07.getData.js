const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAirsoftFields() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.airsoftstation.com/airsoft-fields-in-the-united-states/');

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
}

async function saveDataToFile(data) {
    try {
        const dataString = JSON.stringify(data, null, 2);
        await fs.promises.writeFile('airsoft_fields.json', dataString);
        console.log('Data saved to airsoft_fields.json');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function scrapeAndSaveData() {
    try {
        const airsoftFieldsData = await scrapeAirsoftFields();
        await saveDataToFile(airsoftFieldsData);
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAndSaveData();
