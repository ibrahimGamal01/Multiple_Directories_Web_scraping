// // const puppeteer = require('puppeteer');

// // async function extractInformation(url) {
// //     const browser = await puppeteer.launch();
// //     const page = await browser.newPage();

// //     try {
// //         console.log('Navigating to the URL:', url);
// //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// //         console.log('Extracting information...');
// //         const result = await page.evaluate(() => {
// //             const extractText = (selector) => {
// //                 const element = document.querySelector(selector);
// //                 return element ? element.textContent.replace('Address:', '').trim() : null; 
// //             };

// //             const extractHref = (selector) => {
// //                 const element = document.querySelector(selector);
// //                 const href = element ? element.href : null;
// //                 if (href && href.startsWith('mailto:')) {
// //                     return href.substring(7); // More explicit way to remove 'mailto:'
// //                 }
// //                 return href;
// //             };

// //             return {
// //                 website: extractHref('.single-item._website .item-value a'),
// //                 email: extractHref('.single-item._email .item-value a'),
// //                 location: extractText('.single-item.listing_location .item-value span.more-tax-item'),
// //                 address: extractText('.single-item._address .item-value'), 
// //                 phone: extractHref('.single-item._phone1 .item-value a'),
// //                 keyword: extractText('.single-item.listing_keyword .item-value span.no-data') || extractText('.single-item.listing_keyword .item-value span.more-tax-item')
// //             };
// //         });

// //         await browser.close();
// //         return result;
// //     } catch (error) {
// //         console.error('Error during extraction:', error);
// //         await browser.close();
// //         return null;
// //     }
// // }

// // const url = 'https://arrowtag.com/location/ymca-of-austin/';
// // extractInformation(url)
// //     .then(info => {
// //         console.log('Extracted Information:', info);
// //     })
// //     .catch(error => {
// //         console.error('Error:', error);
// //     });


// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function extractInformation(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//         console.log('Extracting information...');
//         const result = await page.evaluate(() => {
//             const extractText = (selector) => {
//                 const element = document.querySelector(selector);
//                 return element ? element.textContent.replace('Address:', '').trim() : null;
//             };

//             const extractHref = (selector) => {
//                 const element = document.querySelector(selector);
//                 const href = element ? element.href : null;
//                 if (href && href.startsWith('mailto:')) {
//                     return href.substring(7);
//                 }
//                 return href;
//             };

//             return {
//                 website: extractHref('.single-item._website .item-value a'),
//                 email: extractHref('.single-item._email .item-value a'),
//                 location: extractText('.single-item.listing_location .item-value span.more-tax-item'),
//                 address: extractText('.single-item._address .item-value'),
//                 phone: extractHref('.single-item._phone1 .item-value a'),
//                 keyword: extractText('.single-item.listing_keyword .item-value span.no-data') || extractText('.single-item.listing_keyword .item-value span.more-tax-item')
//             };
//         });

//         console.log('Extracted Data:', result);

//         await browser.close();
//         return result;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         await browser.close();
//         return null;
//     }
// }

// async function runExtraction() {
//     const inputFile = 'arrowtag_locations.txt';
//     const outputFile = 'extracted_information.json';
//     const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);

//     const extractedData = [];

//     for (const url of urls) {
//         const data = await extractInformation(url);
//         if (data) {
//             extractedData.push(data);
//         } else {
//             console.log(`Failed to extract data for URL: ${url}`);
//         }
//     }

//     fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
//     console.log(`Extraction completed. Data saved to ${outputFile}`);
// }

// runExtraction().catch(error => console.error('Error during extraction:', error));


// ! 

// 79.arrowtagExtractInfo
const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractInformation(url, retryCount = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Extracting information...');
        const result = await page.evaluate(() => {
            const extractText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.replace('Address:', '').trim() : null;
            };

            const extractHref = (selector) => {
                const element = document.querySelector(selector);
                const href = element ? element.href : null;
                if (href && href.startsWith('mailto:')) {
                    return href.substring(7);
                }
                return href;
            };

            return {
                website: extractHref('.single-item._website .item-value a'),
                email: extractHref('.single-item._email .item-value a'),
                location: extractText('.single-item.listing_location .item-value span.more-tax-item'),
                address: extractText('.single-item._address .item-value'),
                phone: extractHref('.single-item._phone1 .item-value a'),
                keyword: extractText('.single-item.listing_keyword .item-value span.no-data') || extractText('.single-item.listing_keyword .item-value span.more-tax-item')
            };
        });

        console.log('Extracted Data:', result);

        await browser.close();
        return result;
    } catch (error) {
        console.error('Error during extraction:', error);

        if (retryCount > 0) {
            console.log(`Retrying ${retryCount} more times for URL: ${url}`);
            await page.close();
            await browser.close();
            return extractInformation(url, retryCount - 1);
        } else {
            console.log(`Failed to extract data after retries for URL: ${url}`);
            await browser.close();
            return null;
        }
    }
}

async function runExtraction() {
    const inputFile = 'arrowtag_locations.txt';
    const outputFile = 'extracted_information.json';
    const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);

    const extractedData = [];

    for (const url of urls) {
        const data = await extractInformation(url);
        if (data) {
            extractedData.push(data);
        } else {
            console.log(`Failed to extract data for URL: ${url}`);
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    console.log(`Extraction completed. Data saved to ${outputFile}`);
}

runExtraction().catch(error => console.error('Error during extraction:', error));
