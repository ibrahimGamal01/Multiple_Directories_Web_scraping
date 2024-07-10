// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function extractSkatingRinks(url, retryCount = 3) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

//         console.log('Extracting skating rink information...');

//         const data = await page.evaluate(() => {
//             const tableRows = Array.from(document.querySelectorAll('tbody tr'));
//             const skatingRinks = [];

//             tableRows.forEach(row => {
//                 const cell = row.querySelector('td p span font[size="2"]');
//                 if (cell) {
//                     const text = cell.textContent.trim();
                    
//                     // Regex to capture name, address and phone number
//                     const regex = /(.*)\s+(\d{1,5}.*?),\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?\s*(\d{3})[-\s]?(\d{3})[-\s]?(\d{4})/;
//                     const match = text.match(regex);

//                     if (match) {
//                         const name = match[1].trim();
//                         const address = match[2].trim();
//                         const areaCode = match[3];
//                         const phoneNumber = `${match[4]}-${match[5]}`;
//                         skatingRinks.push({ name, address, areaCode, phoneNumber });
//                     }
//                 }
//             });

//             return skatingRinks;
//         });

//         await browser.close();
//         return data;
//     } catch (error) {
//         console.error(`Error during extraction from ${url}:`, error);
//         await browser.close();

//         if (retryCount > 0) {
//             console.log(`Retrying... (${retryCount} attempts left)`);
//             return extractSkatingRinks(url, retryCount - 1);
//         } else {
//             console.error(`Failed to extract data from ${url} after multiple attempts.`);
//             return [];
//         }
//     }
// }

// async function extractFromMultipleURLs(file) {
//     try {
//         const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
//         const results = [];

//         for (const url of urls) {
//             try {
//                 const data = await extractSkatingRinks(url);
//                 results.push(...data); // Merge data into results array
//             } catch (error) {
//                 console.error(`Skipping URL due to repeated failures: ${url}`);
//             }
//         }

//         return results;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         throw error;
//     }
// }

// const inputFile = '63.links.txt';
// extractFromMultipleURLs(inputFile)
//     .then(info => {
//         const outputFile = '63.Data.json';
//         fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
//         console.log('Data extracted and saved to', outputFile);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


// Execution method 2

const fs = require('fs');
const puppeteer = require('puppeteer');

async function extractSkatingRinks(url, retryCount = 3) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

        console.log('Extracting skating rink information...');

        const data = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('tbody tr'));
            const skatingRinks = [];

            tableRows.forEach(row => {
                const cell = row.querySelector('td p span font[size="2"]');
                if (cell) {
                    const text = cell.textContent.trim();
                    skatingRinks.push({ content: text });
                }
            });

            return skatingRinks;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error(`Error during extraction from ${url}:`, error);
        await browser.close();

        if (retryCount > 0) {
            console.log(`Retrying... (${retryCount} attempts left)`);
            return extractSkatingRinks(url, retryCount - 1);
        } else {
            console.error(`Failed to extract data from ${url} after multiple attempts.`);
            return [];
        }
    }
}

async function extractFromMultipleURLs(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        const results = [];

        for (const url of urls) {
            try {
                const data = await extractSkatingRinks(url);
                results.push(...data); // Merge data into results array
            } catch (error) {
                console.error(`Skipping URL due to repeated failures: ${url}`);
            }
        }

        return results;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    }
}

const inputFile = '63.links.txt';
extractFromMultipleURLs(inputFile)
    .then(info => {
        const outputFile = '63.Data.json';
        fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
        console.log('Data extracted and saved to', outputFile);
    })
    .catch(error => {
        console.error('Error:', error);
    });
