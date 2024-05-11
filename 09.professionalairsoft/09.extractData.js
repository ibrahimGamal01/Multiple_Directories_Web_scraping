const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractAirsoftFields(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

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
}

const url = 'https://professionalairsoft.fandom.com/wiki/List_of_airsoft_fields_in_the_United_States';

extractAirsoftFields(url)
    .then(data => {
        fs.writeFile('airsoft_fields.json', JSON.stringify(data, null, 2), (err) => {
            if (err) throw err;
            console.log('Data has been written to JSON file successfully.');
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
