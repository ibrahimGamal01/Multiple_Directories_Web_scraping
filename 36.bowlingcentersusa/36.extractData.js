// const puppeteer = require('puppeteer');

// async function extractBowlingCenters(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

//         console.log('Extracting bowling center information...');

//         const data = await page.evaluate(() => {
//             const tableRows = Array.from(document.querySelectorAll('#table3 tr'));
//             const bowlingCenters = [];

//             tableRows.forEach(row => {
//                 const cell = row.querySelector('td p span');
//                 if (cell) {
//                     const info = cell.textContent.trim().split(/[\r\n]+/).filter(text => text.trim() !== '');
//                     if (info.length === 2) {
//                         const nameAndAddress = info[0].split(/\s{2,}/);
//                         const [name, address] = nameAndAddress;
//                         const details = info[1];

//                         bowlingCenters.push({ name, address, details });
//                     }
//                 }
//             });

//             return bowlingCenters;
//         });

//         console.log('Extracted Bowling Centers Information:', data);

//         await browser.close();
//         return data;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         await browser.close();
//         throw error;
//     }
// }

// const url = 'https://www.bowlingcentersusa.com/alabamabowling.htm';
// extractBowlingCenters(url)
//     .then(info => {
//         console.log('Extracted Information:', info);
//     })
//     .catch(async (error) => {
//         console.error('Error:', error);
//     });



const fs = require('fs');
const puppeteer = require('puppeteer');

async function extractBowlingCenters(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

        console.log('Extracting bowling center information...');

        const data = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('#table3 tr'));
            const bowlingCenters = [];

            tableRows.forEach(row => {
                const cell = row.querySelector('td p span');
                if (cell) {
                    const info = cell.textContent.trim().split(/[\r\n]+/).filter(text => text.trim() !== '');
                    if (info.length === 2) {
                        const nameAndAddress = info[0].split(/\s{2,}/);
                        const [name, address] = nameAndAddress;
                        const details = info[1];

                        bowlingCenters.push({ name, address, details });
                    }
                }
            });

            return bowlingCenters;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during extraction:', error);
        await browser.close();
        throw error;
    }
}

async function extractFromMultipleURLs(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        const results = {};

        for (const url of urls) {
            const key = url.split('/').pop().replace('.htm', '');
            const data = await extractBowlingCenters(url);
            results[key] = data;
        }

        return results;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    }
}

const inputFile = 'links.txt';
extractFromMultipleURLs(inputFile)
    .then(info => {
        const outputFile = 'output.json';
        fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
        console.log('Data extracted and saved to', outputFile);
    })
    .catch(async (error) => {
        console.error('Error:', error);
    });
