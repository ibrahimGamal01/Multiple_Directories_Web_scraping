// // // // // const puppeteer = require('puppeteer');
// // // // // const fs = require('fs');

// // // // // async function extractInformation(url) {
// // // // //     const browser = await puppeteer.launch();
// // // // //     const page = await browser.newPage();

// // // // //     try {
// // // // //         console.log('Navigating to the URL:', url);
// // // // //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// // // // //         const result = await page.evaluate(() => {
// // // // //             const imgLink = document.querySelector('.company-logo-box img').src;
// // // // //             const name = document.querySelector('.content-section_title').textContent.trim();
// // // // //             const address = document.querySelector('[itemprop="address"]').textContent.trim();
// // // // //             const contactEmail = document.querySelector('.btn-email').href;
// // // // //             const contactPhone = document.querySelector('.btn-phone div[itemprop="telephone"]').textContent.trim();
// // // // //             const activities = Array.from(document.querySelectorAll('.first-act ul li')).map(item => item.textContent.trim());
// // // // //             const liveStatus = document.querySelector('.livestatus .yes').textContent.trim();
// // // // //             const liveTimingLink = document.querySelector('.livestatus .yes a').href;

// // // // //             return { name, address, contactEmail, contactPhone, activities, liveStatus, liveTimingLink, imgLink };
// // // // //         });

// // // // //         console.log('Extracted Data:', result);

// // // // //         return result;
// // // // //     } catch (error) {
// // // // //         console.error('Error during extraction:', error);
// // // // //         return null;
// // // // //     } finally {
// // // // //         await browser.close();
// // // // //     }
// // // // // }

// // // // // async function runExtraction() {
// // // // //     const url = 'https://www.kart-center.com/en/tracks/go-kart-rental/pki-paris-kart-indoor-wissous.html';
// // // // //     const data = await extractInformation(url);
// // // // //     if (data) {
// // // // //         const outputFile = 'karting_de_lavilledieu_data.json';
// // // // //         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
// // // // //         console.log(`Extraction completed. Data saved to ${outputFile}`);
// // // // //     } else {
// // // // //         console.log('Failed to extract data.');
// // // // //     }
// // // // // }

// // // // // // Example usage
// // // // // runExtraction().catch(error => console.error('Error:', error));


// // // // const puppeteer = require('puppeteer');
// // // // const fs = require('fs');

// // // // async function extractInformation(url) {
// // // //     const browser = await puppeteer.launch();
// // // //     const page = await browser.newPage();

// // // //     try {
// // // //         console.log('Navigating to the URL:', url);
// // // //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// // // //         const result = await page.evaluate(() => {
// // // //             const imgElement = document.querySelector('.company-logo-box img');
// // // //             const imgLink = imgElement ? imgElement.src : null;

// // // //             const nameElement = document.querySelector('.content-section_title');
// // // //             const name = nameElement ? nameElement.textContent.trim() : null;

// // // //             const addressElement = document.querySelector('[itemprop="address"]');
// // // //             const address = addressElement ? addressElement.textContent.trim() : null;

// // // //             const contactEmailElement = document.querySelector('.btn-email');
// // // //             const contactEmail = contactEmailElement ? contactEmailElement.href : null;

// // // //             const contactPhoneElement = document.querySelector('.btn-phone div[itemprop="telephone"]');
// // // //             const contactPhone = contactPhoneElement ? contactPhoneElement.textContent.trim() : null;

// // // //             const spokenLanguagesElements = document.querySelectorAll('.content-section_block_list li');
// // // //             const spokenLanguages = spokenLanguagesElements ? Array.from(spokenLanguagesElements).map(item => item.textContent.trim()) : [];

// // // //             const meansOfPaymentElements = document.querySelectorAll('.content-section_block_list ~ [itemprop="paymentAccepted"] li');
// // // //             const meansOfPayment = meansOfPaymentElements ? Array.from(meansOfPaymentElements).map(item => item.textContent.trim()) : [];

// // // //             const aboutElement = document.querySelector('.content-section_block_contact-box p');
// // // //             const about = aboutElement ? aboutElement.textContent.trim() : null;

// // // //             const activitiesElements = document.querySelectorAll('.first-act ul li');
// // // //             const activities = activitiesElements ? Array.from(activitiesElements).map(item => item.textContent.trim()) : [];

// // // //             const liveStatusElement = document.querySelector('.livestatus .yes');
// // // //             const liveStatus = liveStatusElement ? liveStatusElement.textContent.trim() : null;

// // // //             const liveTimingLinkElement = document.querySelector('.livestatus .yes a');
// // // //             const liveTimingLink = liveTimingLinkElement ? liveTimingLinkElement.href : null;

// // // //             const latestResultsElements = document.querySelectorAll('.pkaartlist ul li a');
// // // //             const latestResults = latestResultsElements ? Array.from(latestResultsElements).map(item => ({ title: item.textContent.trim(), link: item.href })) : [];

// // // //             return {
// // // //                 name,
// // // //                 address,
// // // //                 contactEmail,
// // // //                 contactPhone,
// // // //                 spokenLanguages,
// // // //                 meansOfPayment,
// // // //                 about,
// // // //                 activities,
// // // //                 liveStatus,
// // // //                 liveTimingLink,
// // // //                 latestResults,
// // // //                 imgLink
// // // //             };
// // // //         });

// // // //         console.log('Extracted Data:', result);

// // // //         return result;
// // // //     } catch (error) {
// // // //         console.error('Error during extraction:', error);
// // // //         return null;
// // // //     } finally {
// // // //         await browser.close();
// // // //     }
// // // // }

// // // // async function runExtraction() {
// // // //     const url = 'https://www.kart-center.com/en/tracks/go-kart-rental/pki-paris-kart-indoor-wissous.html'; // Update with the actual URL
// // // //     const data = await extractInformation(url);
// // // //     if (data) {
// // // //         const outputFile = 'karting_de_lavilledieu_data.json';
// // // //         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
// // // //         console.log(`Extraction completed. Data saved to ${outputFile}`);
// // // //     } else {
// // // //         console.log('Failed to extract data.');
// // // //     }
// // // // }

// // // // // Example usage
// // // // runExtraction().catch(error => console.error('Error:', error));




// // // const puppeteer = require('puppeteer');
// // // const fs = require('fs');

// // // async function extractInformation(url) {
// // //     const browser = await puppeteer.launch();
// // //     const page = await browser.newPage();

// // //     try {
// // //         console.log('Navigating to the URL:', url);
// // //         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

// // //         const openingTime = await page.evaluate(() => {
// // //             const openingTimeElements = document.querySelectorAll('.content-section_block--opening_list dt, .content-section_block--opening_list dd');
// // //             const openingTimeArray = Array.from(openingTimeElements).map(element => element.textContent.trim());
// // //             const openingTimeObj = {};

// // //             for (let i = 0; i < openingTimeArray.length; i += 2) {
// // //                 const day = openingTimeArray[i].replace(':', '');
// // //                 const time = openingTimeArray[i + 1];
// // //                 openingTimeObj[day] = time;
// // //             }

// // //             return openingTimeObj;
// // //         });

// // //         const result = await page.evaluate((openingTime) => { // Pass openingTime as an argument
// // //             const imgElement = document.querySelector('.company-logo-box img');
// // //             const imgLink = imgElement ? imgElement.src : null;

// // //             const nameElement = document.querySelector('.content-section_title');
// // //             const name = nameElement ? nameElement.textContent.trim() : null;

// // //             const addressElement = document.querySelector('[itemprop="address"]');
// // //             const address = addressElement ? addressElement.textContent.trim() : null;

// // //             const contactEmailElement = document.querySelector('.btn-email');
// // //             const contactEmail = contactEmailElement ? contactEmailElement.href : null;

// // //             const contactPhoneElement = document.querySelector('.btn-phone div[itemprop="telephone"]');
// // //             const contactPhone = contactPhoneElement ? contactPhoneElement.textContent.trim() : null;

// // //             const spokenLanguagesElements = document.querySelectorAll('.content-section_block_list li');
// // //             const spokenLanguages = spokenLanguagesElements ? Array.from(spokenLanguagesElements).map(item => item.textContent.trim()) : [];

// // //             const meansOfPaymentElements = document.querySelectorAll('.content-section_block_list ~ [itemprop="paymentAccepted"] li');
// // //             const meansOfPayment = meansOfPaymentElements ? Array.from(meansOfPaymentElements).map(item => item.textContent.trim()) : [];

// // //             const aboutElement = document.querySelector('.content-section_block_contact-box p');
// // //             const about = aboutElement ? aboutElement.textContent.trim() : null;

// // //             const activitiesElements = document.querySelectorAll('.first-act ul li');
// // //             const activities = activitiesElements ? Array.from(activitiesElements).map(item => item.textContent.trim()) : [];

// // //             const liveStatusElement = document.querySelector('.livestatus .yes');
// // //             const liveStatus = liveStatusElement ? liveStatusElement.textContent.trim() : null;

// // //             const liveTimingLinkElement = document.querySelector('.livestatus .yes a');
// // //             const liveTimingLink = liveTimingLinkElement ? liveTimingLinkElement.href : null;

// // //             const latestResultsElements = document.querySelectorAll('.pkaartlist ul li a');
// // //             const latestResults = latestResultsElements ? Array.from(latestResultsElements).map(item => ({ title: item.textContent.trim(), link: item.href })) : [];

// // //             return {
// // //                 name,
// // //                 address,
// // //                 contactEmail,
// // //                 contactPhone,
// // //                 spokenLanguages,
// // //                 meansOfPayment,
// // //                 about,
// // //                 activities,
// // //                 liveStatus,
// // //                 liveTimingLink,
// // //                 latestResults,
// // //                 imgLink,
// // //                 openingTime, // Include opening time data from the argument
// // //             };
// // //         }, openingTime); // Pass openingTime as an argument

// // //         console.log('Extracted Data:', result);

// // //         return result;
// // //     } catch (error) {
// // //         console.error('Error during extraction:', error);
// // //         return null;
// // //     } finally {
// // //         await browser.close();
// // //     }
// // // }

// // // async function runExtraction() {
// // //     const url = 'https://www.kart-center.com/en/tracks/go-kart-rental/pki-paris-kart-indoor-wissous.html'; // Update with the actual URL
// // //     const data = await extractInformation(url);
// // //     if (data) {
// // //         const outputFile = 'karting_de_lavilledieu_data_with_opening_time.json';
// // //         fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
// // //         console.log(`Extraction completed. Data saved to ${outputFile}`);
// // //     } else {
// // //         console.log('Failed to extract data.');
// // //     }
// // // }

// // // // Example usage
// // // runExtraction().catch(error => console.error('Error:', error));



// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function extractInformation(url, retries = 3) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//         const openingTime = await page.evaluate(() => {
//             const openingTimeElements = document.querySelectorAll('.content-section_block--opening_list dt, .content-section_block--opening_list dd');
//             const openingTimeArray = Array.from(openingTimeElements).map(element => element.textContent.trim());
//             const openingTimeObj = {};

//             for (let i = 0; i < openingTimeArray.length; i += 2) {
//                 const day = openingTimeArray[i].replace(':', '');
//                 const time = openingTimeArray[i + 1];
//                 openingTimeObj[day] = time;
//             }

//             return openingTimeObj;
//         });

//         const result = await page.evaluate((openingTime) => {
//             const imgElement = document.querySelector('.company-logo-box img');
//             const imgLink = imgElement ? imgElement.src : null;

//             const nameElement = document.querySelector('.content-section_title');
//             const name = nameElement ? nameElement.textContent.trim() : null;

//             const addressElement = document.querySelector('[itemprop="address"]');
//             const address = addressElement ? addressElement.textContent.trim() : null;

//             const contactEmailElement = document.querySelector('.btn-email');
//             const contactEmail = contactEmailElement ? contactEmailElement.href : null;

//             const contactPhoneElement = document.querySelector('.btn-phone div[itemprop="telephone"]');
//             const contactPhone = contactPhoneElement ? contactPhoneElement.textContent.trim() : null;

//             const spokenLanguagesElements = document.querySelectorAll('.content-section_block_list li');
//             const spokenLanguages = spokenLanguagesElements ? Array.from(spokenLanguagesElements).map(item => item.textContent.trim()) : [];

//             const meansOfPaymentElements = document.querySelectorAll('.content-section_block_list ~ [itemprop="paymentAccepted"] li');
//             const meansOfPayment = meansOfPaymentElements ? Array.from(meansOfPaymentElements).map(item => item.textContent.trim()) : [];

//             const aboutElement = document.querySelector('.content-section_block_contact-box p');
//             const about = aboutElement ? aboutElement.textContent.trim() : null;

//             const activitiesElements = document.querySelectorAll('.first-act ul li');
//             const activities = activitiesElements ? Array.from(activitiesElements).map(item => item.textContent.trim()) : [];

//             const liveStatusElement = document.querySelector('.livestatus .yes');
//             const liveStatus = liveStatusElement ? liveStatusElement.textContent.trim() : null;

//             const liveTimingLinkElement = document.querySelector('.livestatus .yes a');
//             const liveTimingLink = liveTimingLinkElement ? liveTimingLinkElement.href : null;

//             const latestResultsElements = document.querySelectorAll('.pkaartlist ul li a');
//             const latestResults = latestResultsElements ? Array.from(latestResultsElements).map(item => ({ title: item.textContent.trim(), link: item.href })) : [];

//             return {
//                 name,
//                 address,
//                 contactEmail,
//                 contactPhone,
//                 spokenLanguages,
//                 meansOfPayment,
//                 about,
//                 activities,
//                 liveStatus,
//                 liveTimingLink,
//                 latestResults,
//                 imgLink,
//                 openingTime,
//             };
//         }, openingTime);

//         return result;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         if (retries > 0) {
//             console.log(`Retrying extraction for ${url}. Retries left: ${retries}`);
//             await browser.close();
//             return extractInformation(url, retries - 1);
//         } else {
//             return null;
//         }
//     } finally {
//         await browser.close();
//     }
// }

// async function runExtraction(url, retries) {
//     const data = await extractInformation(url, retries);
//     if (data) {
//         const urlFileName = url.split('/').pop().replace('.html', '') + '_data.json';
//         fs.writeFileSync(urlFileName, JSON.stringify(data, null, 2));
//         console.log(`Extraction completed for ${url}. Data saved to ${urlFileName}`);
//     } else {
//         console.log(`Failed to extract data for ${url}.`);
//     }
// }

// async function extractDataFromUrls() {
//     const linksFile = 'links.txt';
//     const urls = fs.readFileSync(linksFile, 'utf8').split('\n').filter(url => url.trim() !== '');

//     for (const url of urls) {
//         await runExtraction(url.trim(), 3); // Retry 3 times
//     }

//     console.log('All extractions completed.');
// }

// // Example usage
// extractDataFromUrls().catch(error => console.error('Error:', error));


const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractInformation(url, retries = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const openingTime = await page.evaluate(() => {
            const openingTimeElements = document.querySelectorAll('.content-section_block--opening_list dt, .content-section_block--opening_list dd');
            const openingTimeArray = Array.from(openingTimeElements).map(element => element.textContent.trim());
            const openingTimeObj = {};

            for (let i = 0; i < openingTimeArray.length; i += 2) {
                const day = openingTimeArray[i].replace(':', '');
                const time = openingTimeArray[i + 1];
                openingTimeObj[day] = time;
            }

            return openingTimeObj;
        });

        const result = await page.evaluate((openingTime) => {
            const imgElement = document.querySelector('.company-logo-box img');
            const imgLink = imgElement ? imgElement.src : null;

            const nameElement = document.querySelector('.content-section_title');
            const name = nameElement ? nameElement.textContent.trim() : null;

            const addressElement = document.querySelector('[itemprop="address"]');
            const address = addressElement ? addressElement.textContent.trim() : null;

            const contactEmailElement = document.querySelector('.btn-email');
            const contactEmail = contactEmailElement ? contactEmailElement.href : null;

            const contactPhoneElement = document.querySelector('.btn-phone div[itemprop="telephone"]');
            const contactPhone = contactPhoneElement ? contactPhoneElement.textContent.trim() : null;

            const spokenLanguagesElements = document.querySelectorAll('.content-section_block_list li');
            const spokenLanguages = spokenLanguagesElements ? Array.from(spokenLanguagesElements).map(item => item.textContent.trim()) : [];

            const meansOfPaymentElements = document.querySelectorAll('.content-section_block_list ~ [itemprop="paymentAccepted"] li');
            const meansOfPayment = meansOfPaymentElements ? Array.from(meansOfPaymentElements).map(item => item.textContent.trim()) : [];

            const aboutElement = document.querySelector('.content-section_block_contact-box p');
            const about = aboutElement ? aboutElement.textContent.trim() : null;

            const activitiesElements = document.querySelectorAll('.first-act ul li');
            const activities = activitiesElements ? Array.from(activitiesElements).map(item => item.textContent.trim()) : [];

            const liveStatusElement = document.querySelector('.livestatus .yes');
            const liveStatus = liveStatusElement ? liveStatusElement.textContent.trim() : null;

            const liveTimingLinkElement = document.querySelector('.livestatus .yes a');
            const liveTimingLink = liveTimingLinkElement ? liveTimingLinkElement.href : null;

            const latestResultsElements = document.querySelectorAll('.pkaartlist ul li a');
            const latestResults = latestResultsElements ? Array.from(latestResultsElements).map(item => ({ title: item.textContent.trim(), link: item.href })) : [];

            return {
                name,
                address,
                contactEmail,
                contactPhone,
                spokenLanguages,
                meansOfPayment,
                about,
                activities,
                liveStatus,
                liveTimingLink,
                latestResults,
                imgLink,
                openingTime,
            };
        }, openingTime);

        return result;
    } catch (error) {
        console.error('Error during extraction:', error);
        if (retries > 0) {
            console.log(`Retrying extraction for ${url}. Retries left: ${retries}`);
            await browser.close();
            return extractInformation(url, retries - 1);
        } else {
            return null;
        }
    } finally {
        await browser.close();
    }
}

async function runExtraction(url, retries, allData) {
    const data = await extractInformation(url, retries);
    if (data) {
        allData.push(data);
        console.log(`Extraction completed for ${url}`);
    } else {
        console.log(`Failed to extract data for ${url}.`);
    }
}

async function extractDataFromUrls() {
    const linksFile = 'links.txt';
    const urls = fs.readFileSync(linksFile, 'utf8').split('\n').filter(url => url.trim() !== '');

    const allData = [];
    for (const url of urls) {
        await runExtraction(url.trim(), 3, allData); // Retry 3 times
    }

    fs.writeFileSync('all_data.json', JSON.stringify(allData, null, 2));
    console.log('All data saved to all_data.json');
}

// Example usage
extractDataFromUrls().catch(error => console.error('Error:', error));
