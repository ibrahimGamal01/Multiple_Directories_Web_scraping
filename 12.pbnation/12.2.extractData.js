// // // const puppeteer = require('puppeteer');

// // // async function extractFieldInformation(url) {
// // //     const browser = await puppeteer.launch();
// // //     const page = await browser.newPage();

// // //     try {
// // //         console.log('Navigating to the URL:', url);
// // //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// // //         console.log('Extracting field information...');

// // //         // Extracting field information from the table
// // //         const result = await page.evaluate(() => {
// // //             const fields = Array.from(document.querySelectorAll('.tborder tr:not(:first-child)'));

// // //             const extractText = (element, selector) => {
// // //                 const subElement = element.querySelector(selector);
// // //                 return subElement ? subElement.textContent.trim() : null;
// // //             };

// // //             const extractImageAlt = (element, alt) => {
// // //                 const img = element.querySelector(`img[alt="${alt}"]`);
// // //                 return img ? true : false;
// // //             };

// // //             const data = fields.map(field => {
// // //                 const name = extractText(field, 'td:first-child > div > div');
// // //                 const address = extractText(field, 'td:nth-child(3)');
// // //                 const addressParts = address ? address.split('<br>').map(line => line.trim()) : ['', '', '', '', ''];
// // //                 const [address1, address2, cityStateZip, country, phone] = addressParts;
// // //                 const website = extractText(field, 'a.fieldicons.website');
// // //                 const email = extractText(field, 'a.fieldicons.revise');
// // //                 const phoneNumber = extractText(field, '.smallfont');

// // //                 return {
// // //                     name,
// // //                     address1,
// // //                     address2,
// // //                     cityStateZip,
// // //                     country,
// // //                     phone,
// // //                     website,
// // //                     email
// // //                 };
// // //             });

// // //             return data;
// // //         });

// // //         // Extracting information from the specific div
// // //         const specificDivInfo = await page.evaluate(() => {
// // //             const specificDiv = document.querySelector('div[style="min-height:60px; height:auto !important; height:60px;"]');
// // //             if (specificDiv) {
// // //                 const name = specificDiv.querySelector('div > a').textContent.trim();
// // //                 const description = specificDiv.querySelector('div[style="text-align: justify; padding: 5px 0;"]').textContent.trim();

// // //                 return { name, description };
// // //             }
// // //             return null;
// // //         });

// // //         console.log('Extracted Field Information:', result);
// // //         console.log('Extracted Specific Div Information:', specificDivInfo);

// // //         await browser.close();
// // //         return { result, specificDivInfo };
// // //     } catch (error) {
// // //         console.error('Error during extraction:', error);
// // //         await browser.close();
// // //         return null;
// // //     }
// // // }

// // // const url = 'https://www.pbnation.com/fieldshow.php?state=ky';
// // // extractFieldInformation(url)
// // //     .then(info => {
// // //         console.log('Extracted Information:', info);
// // //     })
// // //     .catch(error => {
// // //         console.error('Error:', error);
// // //     });


// // const puppeteer = require('puppeteer');

// // async function extractFieldInformation(url) {
// //     const browser = await puppeteer.launch();
// //     const page = await browser.newPage();

// //     try {
// //         console.log('Navigating to the URL:', url);
// //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// //         console.log('Extracting field information...');

// //         // Extracting field information from the table
// //         const result = await page.evaluate(() => {
// //             const fields = Array.from(document.querySelectorAll('.tborder tr:not(:first-child)'));

// //             const extractText = (element, selector) => {
// //                 const subElement = element.querySelector(selector);
// //                 return subElement ? subElement.textContent.trim() : null;
// //             };

// //             const extractImageAlt = (element, alt) => {
// //                 const img = element.querySelector(`img[alt="${alt}"]`);
// //                 return img ? true : false;
// //             };

// //             const data = fields.map(field => {
// //                 const name = extractText(field, 'td:first-child > div > div');
// //                 const address = extractText(field, 'td:nth-child(3)');
// //                 const addressParts = address ? address.split('<br>').map(line => line.trim()) : ['', '', '', '', ''];
// //                 const [address1, address2, cityStateZip, country, phone] = addressParts;
// //                 const phoneNumber = extractText(field, '.smallfont');

// //                 return {
// //                     name,
// //                     address1,
// //                     address2,
// //                     cityStateZip,
// //                     country,
// //                     phone
// //                 };
// //             });

// //             return data;
// //         });

// //         // Extracting information from the specific div
// //         const specificDivInfo = await page.evaluate(() => {
// //             const specificDiv = document.querySelector('div[style="min-height:60px; height:auto !important; height:60px;"]');
// //             if (specificDiv) {
// //                 const name = specificDiv.querySelector('div > a').textContent.trim();
// //                 const description = specificDiv.querySelector('div[style="text-align: justify; padding: 5px 0;"]').textContent.trim();
// //                 const website = specificDiv.querySelector('div > a').href;

// //                 return { name, description, website };
// //             }
// //             return null;
// //         });

// //         console.log('Extracted Field Information:', result);
// //         console.log('Extracted Specific Div Information:', specificDivInfo);

// //         await browser.close();
// //         return { result, specificDivInfo };
// //     } catch (error) {
// //         console.error('Error during extraction:', error);
// //         await browser.close();
// //         return null;
// //     }
// // }

// // const url = 'https://www.pbnation.com/fieldshow.php?state=ky';
// // extractFieldInformation(url)
// //     .then(info => {
// //         console.log('Extracted Information:', info);
// //     })
// //     .catch(error => {
// //         console.error('Error:', error);
// //     });

// // !

// const puppeteer = require('puppeteer');

// async function extractFieldInformation(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//         console.log('Extracting field information...');

//         // Extracting field information from the table
//         const result = await page.evaluate(() => {
//             const fields = Array.from(document.querySelectorAll('.tborder tr:not(:first-child)'));

//             const extractText = (element, selector) => {
//                 const subElement = element.querySelector(selector);
//                 return subElement ? subElement.textContent.trim() : null;
//             };

//             const data = fields.map(field => {
//                 const name = extractText(field, 'td:first-child > div > div');
//                 const address = extractText(field, 'td:nth-child(3)');
//                 const addressParts = address ? address.split('<br>').map(line => line.trim()) : ['', '', '', '', ''];
//                 const [address1, address2, cityStateZip, country, phone] = addressParts;
//                 const phoneNumber = extractText(field, '.smallfont');

//                 return {
//                     name,
//                     address1,
//                     address2,
//                     cityStateZip,
//                     country,
//                     phone
//                 };
//             });

//             return data;
//         });

//         // Extracting information from the specific div
//         const specificDivInfo = await page.evaluate(() => {
//             const specificDiv = document.querySelector('div[style="min-height:60px; height:auto !important; height:60px;"]');
//             if (specificDiv) {
//                 const name = specificDiv.querySelector('div > a').textContent.trim();
//                 const description = specificDiv.querySelector('div[style="text-align: justify; padding: 5px 0;"]').textContent.trim();
//                 const website = specificDiv.querySelector('div > a').href;

//                 // Extracting address information from the description
//                 const addressMatch = description.match(/Address: (.+?)<br>/);
//                 const [_, address1, address2, cityStateZip, country] = addressMatch ? addressMatch[1].split('<br>').map(line => line.trim()) : ['', '', '', '', ''];
//                 const phoneMatch = description.match(/Phone: (.+?)<br>/);
//                 const phone = phoneMatch ? phoneMatch[1].trim() : '';

//                 return { name, address1, address2, cityStateZip, country, phone, website };
//             }
//             return null;
//         });

//         console.log('Extracted Field Information:', result);
//         console.log('Extracted Specific Div Information:', specificDivInfo);

//         await browser.close();
//         return { result, specificDivInfo };
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         await browser.close();
//         return null;
//     }
// }

// const url = 'https://www.pbnation.com/fieldshow.php?state=ky';
// extractFieldInformation(url)
//     .then(info => {
//         console.log('Extracted Information:', info);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


const puppeteer = require('puppeteer');

async function extractFieldInformation(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Extracting field information...');

        const data = await page.evaluate(() => {
            const trElements = Array.from(document.querySelectorAll('.tborder tr'));

            const fieldData = trElements.map(tr => {
                const name = tr.querySelector('.alt1 div > a')?.textContent.trim();
                const description = tr.querySelector('.alt1 div[style="text-align: justify; padding: 5px 0;"]')?.textContent.trim();
                const address = tr.querySelector('.alt1 + td .smallfont')?.textContent.trim();
                const website = tr.querySelector('.alt1 div > a')?.href;
                const email = tr.querySelector('.fieldicons.email')?.href.split(':')[1];

                return { name, address, website, description, email };
            });

            return fieldData.filter(data => data.name && data.address && data.website && data.description && data.email);
        });

        console.log('Extracted Field Information:', data);

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during extraction:', error);
        await browser.close();
        throw error; // Re-throw the error to retry or handle it in the caller function
    }
}

const url = 'https://www.pbnation.com/fieldshow.php?state=ky';
extractFieldInformation(url)
    .then(info => {
        console.log('Extracted Information:', info);
    })
    .catch(async (error) => {
        console.error('Error:', error);
        // Handle retrying here or in the caller function
    });
