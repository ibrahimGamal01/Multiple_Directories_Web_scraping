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

//         const getTextContent = (selector) => {
//             const element = document.querySelector(selector);
//             return element ? element.textContent.trim() : '';
//           };
//       const extractEmail = (text) => {
//         const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
//         const match = text.match(emailRegex);
//         return match ? match[0] : '';
//       };

//       const extractAddress = (text) => {
//         // Simple address extraction, you may need to adjust this based on actual data patterns
//         const addressRegex = /([0-9]+)?\s*[A-Za-z]+\s*[A-Za-z]+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2,}\s*[0-9]{5,6}/;
//         const match = text.match(addressRegex);
//         return match ? match[0] : text;
//       };

//       const extractDetails = (text) => {
//         const details = {
//           tradingHours: '',
//           facilities: '',
//           other: ''
//         };

//         const sections = text.split(/(?=\b(?:Trading Hours|Facilities|What it costs|Walk-ins Allows)\b)/g);

//         sections.forEach(section => {
//           if (section.includes('Trading Hours')) {
//             details.tradingHours = section.replace('Trading Hours', '').trim();
//           } else if (section.includes('Facilities')) {
//             details.facilities = section.replace('Facilities', '').trim();
//           } else {
//             details.other += section.trim() + ' ';
//           }
//         });

//         details.other = details.other.trim();

//         return details;
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
//     const rawAddress = getTextContent('.ipsGrid_span4.data_callout p:last-of-type');
//     const address = rawAddress.replace(/\s*\n\s*/g, ', ');

//       const details = extractDetails(contactText);

//       return { name, tradingHours, email, phone, address, details };
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
//       console.log('Address:', data.address);
//       console.log('Details:', data.details);
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


const fs = require('fs');
const puppeteer = require('puppeteer');

const MAX_RETRIES = 3;

async function scrapeData(url, retries = MAX_RETRIES) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 60000 });

    const data = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
      };

      const extractEmail = (text) => {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = text.match(emailRegex);
        return match ? match[0] : '';
      };

      const extractAddress = (text) => {
        const addressRegex = /([0-9]+)?\s*[A-Za-z]+\s*[A-Za-z]+,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2,}\s*[0-9]{5,6}/;
        const match = text.match(addressRegex);
        return match ? match[0] : text;
      };

      const extractWebsite = (text) => {
        const websiteRegex = /(https?:\/\/[^\s]+)/g;
        const match = text.match(websiteRegex);
        return match ? match[0] : '';
      };

      const extractDetails = (text) => {
        const details = {
          tradingHours: '',
          facilities: '',
          costs: '',
          other: ''
        };

        const sections = text.split(/(?=\b(?:Trading Hours|Facilities|What it costs|Walk-ins Allows)\b)/g);

        sections.forEach(section => {
          if (section.includes('Trading Hours')) {
            details.tradingHours = section.replace('Trading Hours', '').trim();
          } else if (section.includes('Facilities')) {
            details.facilities = section.replace('Facilities', '').trim();
          } else if (section.includes('What it costs')) {
            details.costs = section.replace('What it costs', '').trim();
          } else {
            details.other += section.trim() + ' ';
          }
        });

        details.other = details.other.trim();

        return details;
      };

      const name = document.querySelector('h1').innerText.trim();

      const tradingHoursElement = Array.from(document.querySelectorAll('.data_callout h3')).find(el => el.innerText.includes('Trading Hours'));
      let tradingHours = '';
      if (tradingHoursElement) {
        tradingHours = tradingHoursElement.nextElementSibling.nextSibling.textContent.trim().split('\n').join(', ');
      }

      let email = '';
      const emailElement = document.querySelector('.fa-envelope');
      if (emailElement) {
        email = emailElement.parentElement.innerText.trim();
        email = extractEmail(email);
      }

      const contactSection = tradingHoursElement.closest('.data_callout');
      const contactText = contactSection.innerText;
      if (!email) {
        email = extractEmail(contactText);
      }

      const phoneElement = document.querySelector('.fa-phone');
      let phone = '';
      if (phoneElement) {
        phone = phoneElement.nextSibling.textContent.trim();
      }

      let website = '';
      const websiteElement = document.querySelector('.fa-globe');
      if (websiteElement) {
        website = websiteElement.nextSibling.nextSibling.href.trim();
      }

      const rawAddress = getTextContent('.ipsGrid_span4.data_callout p:last-of-type');
      const address = rawAddress.replace(/\s*\n\s*/g, ', ');

      const details = extractDetails(contactText);

      return { name, tradingHours, email, phone, website, address, details };
    });

    await browser.close();
    return data;
  } catch (error) {
    console.error(`Error scraping data from ${url}:`, error);
    await browser.close();

    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      return scrapeData(url, retries - 1);
    } else {
      console.error(`Failed to scrape data from ${url} after multiple attempts.`);
      return null;
    }
  }
}

async function main() {
  const filePath = './54.locations.txt';
  const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  const results = [];

  for (const url of urls) {
    let retries = MAX_RETRIES;
    let data = null;

    while (retries > 0 && !data) {
      data = await scrapeData(url, retries);
      retries--;
    }

    if (data) {
      console.log(`Data from ${url}:`);
      console.log('Name:', data.name);
      console.log('Trading Hours:', data.tradingHours);
      console.log('Email:', data.email);
      console.log('Phone:', data.phone);
      console.log('Website:', data.website);
      console.log('Address:', data.address);
      console.log('Details:', data.details);
      console.log('---');
      results.push({ url, ...data });
    } else {
      console.error(`Skipping ${url} due to scraping errors.`);
    }
  }

  fs.writeFileSync('./54.Data.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('Data has been written to 54.Data.json');
}

main();
