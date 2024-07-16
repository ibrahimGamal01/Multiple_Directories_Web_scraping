//  Base Code

// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeClimbingGyms(url) {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Function to retry navigation
//     const navigateWithRetry = async (url, retries = 3) => {
//         for (let i = 0; i < retries; i++) {
//             try {
//                 await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
//                 console.log(`Page loaded successfully on attempt ${i + 1}`);
//                 return;
//             } catch (error) {
//                 console.error(`Error loading page on attempt ${i + 1}:`, error);
//                 if (i === retries - 1) throw error;
//             }
//         }
//     };

//     await navigateWithRetry(url);

//     const data = await page.evaluate(() => {
//         const results = [];
//         const paragraphs = document.querySelectorAll('.paragraph');

//         paragraphs.forEach(paragraph => {
//             let names = [];
//             let address = '';
//             let website = '';
//             let foundName = false;

//             // Collect names (first one or two <strong> tags)
//             const strongTags = paragraph.querySelectorAll('strong');
//             strongTags.forEach((strong, index) => {
//                 if (index < 2) {
//                     names.push(strong.textContent.trim());
//                 }
//             });

//             // Collect address and website
//             const elements = paragraph.childNodes;
//             elements.forEach((element, index) => {
//                 if (element.nodeType === Node.TEXT_NODE) {
//                     const text = element.textContent.trim();
//                     if (text && names.length > 0 && !website) {
//                         address += text + ' ';
//                     }
//                 } else if (element.nodeName === 'A') {
//                     const href = element.getAttribute('href');
//                     if (href && href.includes('www')) {
//                         website = href;
//                     }
//                 }
//             });

//             if (names.length > 0 && address) {
//                 results.push({
//                     name: names.join(' - '),
//                     address: address.trim(),
//                     website: website || 'N/A'
//                 });
//             }
//         });

//         return results;
//     });

//     await browser.close();
//     return data;
// }

// async function saveDataToFile(data, outputFile) {
//     try {
//         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
//         console.log(`Data has been written to ${outputFile} successfully.`);
//     } catch (error) {
//         console.error('Error saving data:', error);
//     }
// }

// async function main() {
//     const url = 'https://www.climbphilippines.com/gym-directory.html';
//     try {
//         const data = await scrapeClimbingGyms(url);
//         const outputFilePath = 'climbing_gyms.json';
//         saveDataToFile(data, outputFilePath);
//     } catch (error) {
//         console.error('Error during main execution:', error);
//     }
// }

// main();

// ! ----------------------------------------------------------------------------------------------------

//  Sample Scrapping 1

const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeClimbingGyms(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Function to retry navigation
    const navigateWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
                console.log(`Page loaded successfully on attempt ${i + 1}`);
                return;
            } catch (error) {
                console.error(`Error loading page on attempt ${i + 1}:`, error);
                if (i === retries - 1) throw error;
            }
        }
    };

    await navigateWithRetry(url);

    const data = await page.evaluate(() => {
        const results = [];
        const paragraphs = document.querySelectorAll('.paragraph');

        const extractPhoneNumbers = (text) => {
            const phonePattern = /\+\d{1,4}\s*\d{1,4}\s*\(?\d{1,4}\)?\s*-?\d{1,4}-?\d{1,4}(?:\s*x\s*\d+)?/g;
            const matches = text.match(phonePattern);
            return matches ? matches : [];
        };

        paragraphs.forEach(paragraph => {
            let names = [];
            let address = '';
            let website = '';
            let phoneNumbers = [];
            let otherDetails = [];
            let currentName = '';

            const elements = paragraph.childNodes;
            elements.forEach((element) => {
                if (element.nodeType === Node.TEXT_NODE) {
                    const text = element.textContent.trim();
                    if (text) {
                        if (extractPhoneNumbers(text).length > 0) {
                            phoneNumbers = phoneNumbers.concat(extractPhoneNumbers(text));
                        } else {
                            address += text + ' ';
                        }
                    }
                } else if (element.nodeName === 'STRONG') {
                    if (currentName) {
                        results.push({
                            name: currentName,
                            address: address.trim() || 'N/A',
                            website: website || 'N/A',
                            phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : ['N/A'],
                            otherDetails: otherDetails.length > 0 ? otherDetails : ['N/A']
                        });
                        address = '';
                        website = '';
                        phoneNumbers = [];
                        otherDetails = [];
                    }
                    currentName = element.textContent.trim();
                } else if (element.nodeName === 'A') {
                    const href = element.getAttribute('href');
                    if (href && href.includes('www')) {
                        website = href;
                    } else {
                        otherDetails.push(href);
                    }
                }
            });

            if (currentName) {
                results.push({
                    name: currentName,
                    address: address.trim() || 'N/A',
                    website: website || 'N/A',
                    phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : ['N/A'],
                    otherDetails: otherDetails.length > 0 ? otherDetails : ['N/A']
                });
            }
        });

        return results;
    });

    await browser.close();
    return data;
}

async function saveDataToFile(data, outputFile) {
    try {
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log(`Data has been written to ${outputFile} successfully.`);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function main() {
    const url = 'https://www.climbphilippines.com/gym-directory.html';
    try {
        const data = await scrapeClimbingGyms(url);
        const outputFilePath = '28.Data.json';
        saveDataToFile(data, outputFilePath);
    } catch (error) {
        console.error('Error during main execution:', error);
    }
}

main();
