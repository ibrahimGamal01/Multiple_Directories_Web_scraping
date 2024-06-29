const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://airsoftpal.com/airsoft-fields-united-states/', { waitUntil: 'networkidle0' });

    const data = await page.evaluate(() => {
        const result = [];
        const states = document.querySelectorAll('h3');

        states.forEach((stateElement) => {
            const state = stateElement.innerText.trim();
            const ulElement = stateElement.nextElementSibling;

            if (ulElement && ulElement.tagName.toLowerCase() === 'ul') {
                const listItems = ulElement.querySelectorAll('li');

                listItems.forEach((li) => {
                    const link = li.querySelector('a');
                    if (link) {
                        const name = link.innerText.trim();
                        const website = link.href;
                        result.push({ name, website, state });
                    }
                });
            }
        });

        return result;
    });

    await browser.close();

    // Write the data to a JSON file
    fs.writeFileSync('airsoft_fields.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to airsoft_fields.json');
        }
    });
})();
