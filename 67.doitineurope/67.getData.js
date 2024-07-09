// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeRollerSkatingRinks() {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         const url = 'http://www.doitineurope.com/uk/attractions/roller-skating-rinks.htm';
//         await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

//         // Evaluate the page and extract data
//         const data = await page.evaluate(() => {
//             const results = [];

//             // Helper function to extract phone, address, and details
//             const extractPhoneAddressDetails = (text) => {
//                 const phoneIndex = text.indexOf('Phone:');
//                 if (phoneIndex !== -1) {
//                     const address = text.substring(0, phoneIndex).trim();
//                     const details = text.substring(phoneIndex + 6).trim(); // Skip "Phone:" which is 6 characters long
//                     return { address, details };
//                 } else {
//                     return { address: text.trim(), details: '' };
//                 }
//             };

//             // Extract data from each <p> element
//             const paragraphs = document.querySelectorAll('#pagecontents > p');
//             paragraphs.forEach(p => {
//                 const anchor = p.querySelector('a');
//                 if (anchor) {
//                     const name = anchor.textContent.trim();
//                     const href = anchor.href;
//                     const { address, details } = extractPhoneAddressDetails(p.textContent);
                    
//                     results.push({
//                         Name: name,
//                         Address: address,
//                         Details: details,
//                         Link: href
//                     });
//                 }
//             });

//             return results;
//         });

//         await browser.close();

//         // Write data to JSON file
//         const outputFile = '67.Data.json';
//         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
//         console.log(`Data has been scraped and saved to ${outputFile}`);
//     } catch (error) {
//         console.error('Error during scraping:', error);
//         await browser.close();
//     }
// }

// // Run the scraping function
// scrapeRollerSkatingRinks();


//  Sample code 2 based on the phone to get the rest of the data, when the phone is not there, the rest will be the details
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeRollerSkatingRinks() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const url = 'http://www.doitineurope.com/uk/attractions/roller-skating-rinks.htm';
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Increased timeout to 60 seconds

        // Evaluate the page and extract data
        const data = await page.evaluate(() => {
            const results = [];

            // Helper function to extract phone, address, and details
            const extractPhoneAddressDetails = (text) => {
                const phoneIndex = text.indexOf('Phone:');
                let address = '';
                let details = '';

                if (phoneIndex !== -1) {
                    address = text.substring(0, phoneIndex).trim();
                    details = text.substring(phoneIndex + 6).trim(); // Skip "Phone:" which is 6 characters long
                } else {
                    details = text.trim();
                }

                return { address, details };
            };

            // Extract data from each <p> element
            const paragraphs = document.querySelectorAll('#pagecontents > p');
            paragraphs.forEach(p => {
                const anchor = p.querySelector('a');
                if (anchor) {
                    const name = anchor.textContent.trim();
                    const href = anchor.href;
                    const textContent = p.textContent.trim();
                    const { address, details } = extractPhoneAddressDetails(textContent);
                    
                    let phone = '';
                    const phoneMatch = textContent.match(/Phone:\s*(\d[\d\s]*)/);
                    if (phoneMatch) {
                        phone = phoneMatch[1].trim();
                    }

                    results.push({
                        Name: name,
                        Address: address,
                        Details: details,
                        Phone: phone,
                        Link: href
                    });
                }
            });

            return results;
        });

        await browser.close();

        // Write data to JSON file
        const outputFile = '67.Data.json';
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log(`Data has been scraped and saved to ${outputFile}`);
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
    }
}

// Run the scraping function
scrapeRollerSkatingRinks();
