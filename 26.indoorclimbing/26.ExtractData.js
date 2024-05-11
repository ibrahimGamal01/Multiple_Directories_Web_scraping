// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function extractClimbingGyms(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000});

//     const data = await page.evaluate(() => {
//         const cities = Array.from(document.querySelectorAll('.city'));
//         let gyms = [];

//         cities.forEach(city => {
//             let currentCity = city.textContent.trim();
//             let sibling = city.nextElementSibling;
            
//             while (sibling && !sibling.classList.contains('city')) {
//                 if (sibling.tagName.toLowerCase() === 'p') {
//                     const name = sibling.querySelector('b')?.textContent.trim();
//                     const lines = sibling.textContent.split('<br>').map(line => line.trim());
//                     const address = lines[1] || null;
//                     const phone = lines[2] || null;
//                     const website = sibling.querySelector('a')?.href;
//                     const description = sibling.querySelector('span.rt')?.nextSibling.textContent.trim();

//                     gyms.push({
//                         city: currentCity,
//                         name,
//                         address,
//                         phone,
//                         website,
//                         description
//                     });
//                 }
//                 sibling = sibling.nextElementSibling;
//             }
//         });

//         return gyms;
//     });

//     await browser.close();

//     return data;
// }

// async function runExtractionFromUrls(inputFile) {
//     try {
//         const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
//         let allData = [];

//         for (const url of urls) {
//             console.log(`Extracting data from ${url}`);
//             const data = await extractClimbingGyms(url);
//             allData = allData.concat(data);
//         }

//         fs.writeFile('climbing_gyms.json', JSON.stringify(allData, null, 2), (err) => {
//             if (err) throw err;
//             console.log('Data has been written to JSON file successfully.');
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// const inputUrlsFile = 'gym_links.txt';
// runExtractionFromUrls(inputUrlsFile);

// ! -------------------------------------------------------------------------------------------

const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractClimbingGyms(url, retryCount = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

        const data = await page.evaluate(() => {
            const cities = Array.from(document.querySelectorAll('.city'));
            let gyms = [];

            cities.forEach(city => {
                let currentCity = city.textContent.trim();
                let sibling = city.nextElementSibling;

                while (sibling && !sibling.classList.contains('city')) {
                    if (sibling.tagName.toLowerCase() === 'p') {
                        const name = sibling.querySelector('b')?.textContent.trim();
                        const lines = sibling.textContent.split('<br>').map(line => line.trim());
                        const address = lines[1] || null;
                        const phone = lines[2] || null;
                        const website = sibling.querySelector('a')?.href;
                        const description = sibling.querySelector('span.rt')?.nextSibling.textContent.trim();

                        gyms.push({
                            city: currentCity,
                            name,
                            address,
                            phone,
                            website,
                            description
                        });
                    }
                    sibling = sibling.nextElementSibling;
                }
            });

            return gyms;
        });

        await browser.close();

        return data;
    } catch (error) {
        console.error('Error during extraction:', error);

        if (retryCount > 0) {
            console.log(`Retrying ${retryCount} more times for URL: ${url}`);
            await page.close();
            await browser.close();
            return extractClimbingGyms(url, retryCount - 1);
        } else {
            console.log(`Failed to extract data after retries for URL: ${url}`);
            await browser.close();
            return null;
        }
    }
}

async function runExtractionFromUrls(inputFile) {
    try {
        const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
        let allData = [];

        for (const url of urls) {
            console.log(`Extracting data from ${url}`);
            const data = await extractClimbingGyms(url);
            if (data) {
                allData = allData.concat(data);
            } else {
                console.log(`Skipping URL: ${url}`);
            }
        }

        fs.writeFile('climbing_gyms.json', JSON.stringify(allData, null, 2), (err) => {
            if (err) throw err;
            console.log('Data has been written to JSON file successfully.');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputUrlsFile = 'gym_links.txt';
runExtractionFromUrls(inputUrlsFile);

