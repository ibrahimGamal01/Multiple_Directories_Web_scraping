// const puppeteer = require('puppeteer');


// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://www.aza.org/find-a-zoo-or-aquarium?locale=en', { waitUntil: 'networkidle0' });

//     // Extracting the data from the page
//     const result = await page.evaluate(() => {
//         const data = [];
//         const elements = document.querySelectorAll('.columns .column'); // Selecting all columns within the main container

//         elements.forEach(element => {
//             const title = element.querySelector('strong a')?.textContent.trim();
//             const link = element.querySelector('strong a')?.href.trim();
//             const location = element.textContent.split(',')[1]?.split('\n')[0]?.trim();
//             const accreditation = element.textContent.split('Accredited through')[1]?.trim();

//             data.push({ title, link, location, accreditation });
//         });

//         return data;
//     });

//     console.log(result);
//     await browser.close();
// })();

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

            results.push({ title, link, location, accreditation });
        });

        return results;
    });

    // Saving the data to a JSON file
    fs.writeFile('zooData.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('Data successfully written to zooData.json');
        }
    });

    await browser.close();
})();
