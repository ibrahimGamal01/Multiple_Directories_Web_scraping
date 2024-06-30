const puppeteer = require('puppeteer');
const fs = require('fs'); // Node.js file system module to write files

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.aza.org/find-a-zoo-or-aquarium?locale=en', { waitUntil: 'networkidle0', timeout: 60000 }); // 60 seconds

    // Extracting the data from the page
    const data = await page.evaluate(() => {
        const results = [];
        const elements = document.querySelectorAll('.columns .column'); // Selecting all columns within the main container

        elements.forEach(element => {
            const title = element.querySelector('strong a')?.textContent.trim();
            const link = element.querySelector('strong a')?.href.trim();
            const locationDetails = element.textContent.split(',')[1];
            const location = locationDetails ? locationDetails.split('\n')[0].trim() : null;
            const accreditationDetails = element.textContent.split('Accredited through')[1];
            const accreditation = accreditationDetails ? accreditationDetails.trim() : null;
            const stateDetails = element.querySelector('strong')?.textContent.split(',')[1]?.trim();
            const state = stateDetails ? stateDetails.split(/\s+/)[0] : null;

            results.push({ title, link, location, state, accreditation });
        });

        return results;
    });

    // Saving the data to a JSON file
    fs.writeFile('48.Dataa.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to zooData.json');
        }
    });

    await browser.close();
})();
