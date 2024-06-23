// const fs = require('fs');
// const puppeteer = require('puppeteer');

// const MAX_RETRIES = 3;

// async function scrapeLocationData(url, retries = MAX_RETRIES) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url, { waitUntil: 'domcontentloaded' });

//     // Wait for the main content selectors
//     await page.waitForSelector('.content-single-dz_listing-hero-inner h1', { timeout: 60000 });
//     await page.waitForSelector('.ipsGrid_span4.data_callout', { timeout: 60000 });

//     const data = await page.evaluate(() => {
        
//       const getTextContent = (selector) => {
//         const element = document.querySelector(selector);
//         return element ? element.textContent.trim() : '';
//       };

//       const getInnerHTML = (selector) => {
//         const element = document.querySelector(selector);
//         return element ? element.innerHTML.trim() : '';
//       };

//       const name = getTextContent('.content-single-dz_listing-hero-inner h1');

//       const tradingHoursHeader = document.evaluate(
//         "//h3[text()='Trading Hours']", 
//         document, 
//         null, 
//         XPathResult.FIRST_ORDERED_NODE_TYPE, 
//         null
//       ).singleNodeValue;

//       const tradingHours = tradingHoursHeader ? tradingHoursHeader.nextElementSibling.innerHTML.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '').trim() : '';

//       const costsHeader = document.evaluate(
//         "//h3[text()='What it costs']", 
//         document, 
//         null, 
//         XPathResult.FIRST_ORDERED_NODE_TYPE, 
//         null
//       ).singleNodeValue;

//       const costs = costsHeader ? costsHeader.nextElementSibling.innerHTML.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '').trim() : '';

//       const emailElement = document.querySelector('.fa-envelope');
//       const email = emailElement ? emailElement.nextSibling.textContent.trim() : '';

//       const phoneElement = document.querySelector('.fa-phone');
//       const phone = phoneElement ? phoneElement.nextSibling.textContent.trim() : '';

//       const rawAddress = getTextContent('.ipsGrid_span4.data_callout p:last-of-type');
//       const address = rawAddress.replace(/\s*\n\s*/g, ', ');

//       return { name, tradingHours, costs, email, phone, address };
//     });

//     await browser.close();
//     return data;
//   } catch (error) {
//     console.error(`Error scraping data from ${url}:`, error);
//     await browser.close();

//     if (retries > 0) {
//       console.log(`Retrying... (${retries} attempts left)`);
//       return scrapeLocationData(url, retries - 1);
//     } else {
//       console.error(`Failed to scrape data from ${url} after multiple attempts.`);
//       return null;
//     }
//   }
// }

// async function main() {
//   const filePath = './54.locations.txt';
//   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
//   const results = [];

//   for (const url of urls) {
//     let retries = MAX_RETRIES;
//     let data = null;

//     while (retries > 0 && !data) {
//       data = await scrapeLocationData(url, retries);
//       retries--;
//     }

//     if (data) {
//       console.log(`Data from ${url}:`);
//       console.log(data);
//       console.log('---');
//       results.push({ url, ...data });
//     } else {
//       console.error(`Skipping ${url} due to extraction errors.`);
//     }
//   }

//   fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
//   console.log('Data has been written to 54.Data.json');
// }

// main();
// // // // // const fs = require('fs');
// // // // // const puppeteer = require('puppeteer');

// // // // // const MAX_RETRIES = 3;

// // // // // async function scrapeLocationData(url, retries = MAX_RETRIES) {
// // // // //   const browser = await puppeteer.launch({ headless: true });
// // // // //   const page = await browser.newPage();

// // // // //   try {
// // // // //     await page.goto(url, { waitUntil: 'domcontentloaded' });

// // // // //     // Wait for the main content selectors
// // // // //     await page.waitForSelector('.content-single-dz_listing-hero-inner h1', { timeout: 60000 });
// // // // //     await page.waitForSelector('.ipsGrid_span4.data_callout', { timeout: 60000 });

// // // // //     const data = await page.evaluate(() => {
// // // // //       const getTextContent = (selector) => {
// // // // //         const element = document.querySelector(selector);
// // // // //         return element ? element.textContent.trim() : '';
// // // // //       };

// // // // //       const getInnerHTML = (selector) => {
// // // // //         const element = document.querySelector(selector);
// // // // //         return element ? element.innerHTML.trim() : '';
// // // // //       };

// // // // //       const name = getTextContent('.content-single-dz_listing-hero-inner h1');

// // // // //       const tradingHoursHeader = document.evaluate(
// // // // //         "//h3[text()='Trading Hours']", 
// // // // //         document, 
// // // // //         null, 
// // // // //         XPathResult.FIRST_ORDERED_NODE_TYPE, 
// // // // //         null
// // // // //       ).singleNodeValue;

// // // // //       const tradingHours = tradingHoursHeader ? tradingHoursHeader.nextElementSibling.innerHTML.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '').trim() : '';

// // // // //       const costsHeader = document.evaluate(
// // // // //         "//h3[text()='What it costs']", 
// // // // //         document, 
// // // // //         null, 
// // // // //         XPathResult.FIRST_ORDERED_NODE_TYPE, 
// // // // //         null
// // // // //       ).singleNodeValue;

// // // // //       const costs = costsHeader ? costsHeader.nextElementSibling.innerHTML.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '').trim() : '';

// // // // //       const details = getTextContent('.ipsGrid_span8');

// // // // //       const emailElement = document.querySelector('.fa-envelope');
// // // // //       const email = emailElement ? emailElement.nextSibling.textContent.trim() : '';

// // // // //       const phoneElement = document.querySelector('.fa-phone');
// // // // //       const phone = phoneElement ? phoneElement.nextSibling.textContent.trim() : '';

// // // // //       const rawAddress = getTextContent('.ipsGrid_span4.data_callout p:last-of-type');
// // // // //       const address = rawAddress.replace(/\s*\n\s*/g, ', ');

// // // // //       return { name, tradingHours, costs, details, email, phone, address };
// // // // //     });

// // // // //     await browser.close();
// // // // //     return data;
// // // // //   } catch (error) {
// // // // //     console.error(`Error scraping data from ${url}:`, error);
// // // // //     await browser.close();

// // // // //     if (retries > 0) {
// // // // //       console.log(`Retrying... (${retries} attempts left)`);
// // // // //       return scrapeLocationData(url, retries - 1);
// // // // //     } else {
// // // // //       console.error(`Failed to scrape data from ${url} after multiple attempts.`);
// // // // //       return null;
// // // // //     }
// // // // //   }
// // // // // }

// // // // // async function main() {
// // // // //   const filePath = './54.locations.txt';
// // // // //   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
// // // // //   const results = [];

// // // // //   for (const url of urls) {
// // // // //     let retries = MAX_RETRIES;
// // // // //     let data = null;

// // // // //     while (retries > 0 && !data) {
// // // // //       data = await scrapeLocationData(url, retries);
// // // // //       retries--;
// // // // //     }

// // // // //     if (data) {
// // // // //       console.log(`Data from ${url}:`);
// // // // //       console.log(data);
// // // // //       console.log('---');
// // // // //       results.push({ url, ...data });
// // // // //     } else {
// // // // //       console.error(`Skipping ${url} due to extraction errors.`);
// // // // //     }
// // // // //   }

// // // // //   fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
// // // // //   console.log('Data has been written to 54.Data.json');
// // // // // }

// // // // // main();


// // // const fs = require('fs');
// // // const puppeteer = require('puppeteer');

// // // const MAX_RETRIES = 3;

// // // async function scrapeData(url, retries = MAX_RETRIES) {
// // //   const browser = await puppeteer.launch({ headless: true });
// // //   const page = await browser.newPage();

// // //   try {
// // //     await page.goto(url, { waitUntil: 'domcontentloaded' });
// // //     await page.waitForSelector('h1', { timeout: 60000 });

// // //     const data = await page.evaluate(() => {
// // //       const extractEmail = (text) => {
// // //         const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// // //         const match = text.match(emailRegex);
// // //         return match ? match[0] : '';
// // //       };

// // //       const name = document.querySelector('h1').innerText.trim();

// // //       const tradingHoursElement = Array.from(document.querySelectorAll('.data_callout h3')).find(el => el.innerText.includes('Trading Hours'));
// // //       let tradingHours = '';
// // //       if (tradingHoursElement) {
// // //         tradingHours = tradingHoursElement.nextElementSibling.nextSibling.textContent.trim().split('\n').join(', ');
// // //       }

// // //       let email = '';
// // //       const emailElement = document.querySelector('.fa-envelope');
// // //       if (emailElement) {
// // //         email = emailElement.parentElement.innerText.trim();
// // //         email = extractEmail(email);
// // //       }

// // //       const contactSection = tradingHoursElement.closest('.data_callout');
// // //       const contactText = contactSection.innerText;
// // //       if (!email) {
// // //         email = extractEmail(contactText);
// // //       }

// // //       const phoneElement = document.querySelector('.fa-phone');
// // //       let phone = '';
// // //       if (phoneElement) {
// // //         phone = phoneElement.nextSibling.textContent.trim();
// // //       }

// // //       const addressElement = contactSection.querySelector('p:last-of-type');
// // //       let address = '';
// // //       if (addressElement) {
// // //         address = addressElement.innerText.trim().split('\n').join(', ');
// // //       }

// // //       return { name, tradingHours, email, phone, address };
// // //     });

// // //     await browser.close();
// // //     return data;
// // //   } catch (error) {
// // //     console.error(`Error scraping data from ${url}:`, error);
// // //     await browser.close();

// // //     if (retries > 0) {
// // //       console.log(`Retrying... (${retries} attempts left)`);
// // //       return scrapeData(url, retries - 1);
// // //     } else {
// // //       console.error(`Failed to scrape data from ${url} after multiple attempts.`);
// // //       return null;
// // //     }
// // //   }
// // // }

// // // async function main() {
// // //   const filePath = './54.locations.txt';
// // //   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
// // //   const results = [];

// // //   for (const url of urls) {
// // //     let retries = MAX_RETRIES;
// // //     let data = null;

// // //     while (retries > 0 && !data) {
// // //       data = await scrapeData(url, retries);
// // //       retries--;
// // //     }

// // //     if (data) {
// // //       console.log(`Data from ${url}:`);
// // //       console.log('Name:', data.name);
// // //       console.log('Trading Hours:', data.tradingHours);
// // //       console.log('Email:', data.email);
// // //       console.log('Phone:', data.phone);
// // //       console.log('Address:', data.address);
// // //       console.log('---');
// // //       results.push({ url, ...data });
// // //     } else {
// // //       console.error(`Skipping ${url} due to scraping errors.`);
// // //     }
// // //   }

// // //   fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
// // //   console.log('Data has been written to 54.Data.json');
// // // }

// // // main();


// // const fs = require('fs');
// // const puppeteer = require('puppeteer');

// // const MAX_RETRIES = 3;

// // async function scrapeData(url, retries = MAX_RETRIES) {
// //   const browser = await puppeteer.launch({ headless: true });
// //   const page = await browser.newPage();

// //   try {
// //     await page.goto(url, { waitUntil: 'domcontentloaded' });
// //     await page.waitForSelector('h1', { timeout: 60000 });

// //     const data = await page.evaluate(() => {
// //       const extractEmail = (text) => {
// //         const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// //         const match = text.match(emailRegex);
// //         return match ? match[0] : '';
// //       };

// //       const extractAddress = (text) => {
// //         const addressRegex = /\d+\s+([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+),\s[a-zA-Z\s]+,\s[a-zA-Z\s]+,\s[A-Za-z]{2,}\s\d{5}/;
// //         const match = text.match(addressRegex);
// //         return match ? match[0] : text;
// //       };

// //       const name = document.querySelector('h1').innerText.trim();

// //       const tradingHoursElement = Array.from(document.querySelectorAll('.data_callout h3')).find(el => el.innerText.includes('Trading Hours'));
// //       let tradingHours = '';
// //       if (tradingHoursElement) {
// //         tradingHours = tradingHoursElement.nextElementSibling.nextSibling.textContent.trim().split('\n').join(', ');
// //       }

// //       let email = '';
// //       const emailElement = document.querySelector('.fa-envelope');
// //       if (emailElement) {
// //         email = emailElement.parentElement.innerText.trim();
// //         email = extractEmail(email);
// //       }

// //       const contactSection = tradingHoursElement.closest('.data_callout');
// //       const contactText = contactSection.innerText;
// //       if (!email) {
// //         email = extractEmail(contactText);
// //       }

// //       const phoneElement = document.querySelector('.fa-phone');
// //       let phone = '';
// //       if (phoneElement) {
// //         phone = phoneElement.nextSibling.textContent.trim();
// //       }

// //       let address = '';
// //       const addressElement = contactSection.querySelector('p:last-of-type');
// //       if (addressElement) {
// //         address = extractAddress(addressElement.innerText.trim().split('\n').join(', '));
// //       } else {
// //         address = extractAddress(contactText);
// //       }

// //       return { name, tradingHours, email, phone, address };
// //     });

// //     await browser.close();
// //     return data;
// //   } catch (error) {
// //     console.error(`Error scraping data from ${url}:`, error);
// //     await browser.close();

// //     if (retries > 0) {
// //       console.log(`Retrying... (${retries} attempts left)`);
// //       return scrapeData(url, retries - 1);
// //     } else {
// //       console.error(`Failed to scrape data from ${url} after multiple attempts.`);
// //       return null;
// //     }
// //   }
// // }

// // async function main() {
// //   const filePath = './54.locations.txt';
// //   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
// //   const results = [];

// //   for (const url of urls) {
// //     let retries = MAX_RETRIES;
// //     let data = null;

// //     while (retries > 0 && !data) {
// //       data = await scrapeData(url, retries);
// //       retries--;
// //     }

// //     if (data) {
// //       console.log(`Data from ${url}:`);
// //       console.log('Name:', data.name);
// //       console.log('Trading Hours:', data.tradingHours);
// //       console.log('Email:', data.email);
// //       console.log('Phone:', data.phone);
// //       console.log('Address:', data.address);
// //       console.log('---');
// //       results.push({ url, ...data });
// //     } else {
// //       console.error(`Skipping ${url} due to scraping errors.`);
// //     }
// //   }

// //   fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
// //   console.log('Data has been written to 54.Data.json');
// // }

// // main();



// const fs = require('fs');
// const puppeteer = require('puppeteer');

// const MAX_RETRIES = 3;

// async function scrapeData(url, retries = MAX_RETRIES) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url, { waitUntil: 'domcontentloaded' });
//     await page.waitForSelector('h1', { timeout: 60000 });

//     const data = await page.evaluate(() => {
//       const extractEmail = (text) => {
//         const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
//         const match = text.match(emailRegex);
//         return match ? match[0] : '';
//       };

//       const extractdetails = (text) => {
//         const detailsRegex = /\d+\s+([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+),\s[a-zA-Z\s]+,\s[a-zA-Z\s]+,\s[A-Za-z]{2,}\s\d{5}/;
//         const match = text.match(detailsRegex);
//         return match ? match[0] : text;
//       };

//       const name = document.querySelector('h1').innerText.trim();

//       const tradingHoursElement = Array.from(document.querySelectorAll('.data_callout h3')).find(el => el.innerText.includes('Trading Hours'));
//       let tradingHours = '';
//       if (tradingHoursElement) {
//         tradingHours = tradingHoursElement.nextElementSibling.nextSibling.textContent.trim().split('\n').join(', ');
//       }

//       let email = '';
//       const emailElement = document.querySelector('.fa-envelope');
//       if (emailElement) {
//         email = emailElement.parentElement.innerText.trim();
//         email = extractEmail(email);
//       }

//       const contactSection = tradingHoursElement.closest('.data_callout');
//       const contactText = contactSection.innerText;
//       if (!email) {
//         email = extractEmail(contactText);
//       }

//       const phoneElement = document.querySelector('.fa-phone');
//       let phone = '';
//       if (phoneElement) {
//         phone = phoneElement.nextSibling.textContent.trim();
//       }

//       let details = '';
//       const detailsElement = contactSection.querySelector('p:last-of-type');
//       if (detailsElement) {
//         details = extractdetails(detailsElement.innerText.trim().split('\n').join(', '));
//       } else {
//         details = extractdetails(contactText);
//       }

//       return { name, tradingHours, email, phone, details };
//     });

//     await browser.close();
//     return data;
//   } catch (error) {
//     console.error(`Error scraping data from ${url}:`, error);
//     await browser.close();

//     if (retries > 0) {
//       console.log(`Retrying... (${retries} attempts left)`);
//       return scrapeData(url, retries - 1);
//     } else {
//       console.error(`Failed to scrape data from ${url} after multiple attempts.`);
//       return null;
//     }
//   }
// }

// async function main() {
//   const filePath = './54.locations.txt';
//   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
//   const results = [];

//   for (const url of urls) {
//     let retries = MAX_RETRIES;
//     let data = null;

//     while (retries > 0 && !data) {
//       data = await scrapeData(url, retries);
//       retries--;
//     }

//     if (data) {
//       console.log(`Data from ${url}:`);
//       console.log('Name:', data.name);
//       console.log('Trading Hours:', data.tradingHours);
//       console.log('Email:', data.email);
//       console.log('Phone:', data.phone);
//       console.log('details:', data.details);
//       console.log('---');
//       results.push({ url, ...data });
//     } else {
//       console.error(`Skipping ${url} due to scraping errors.`);
//     }
//   }

//   fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
//   console.log('Data has been written to 54.Data.json');
// }

// main();