// // // const fs = require('fs');
// // // const puppeteer = require('puppeteer');

// // // async function scrapeData(url) {
// // //   const browser = await puppeteer.launch({ headless: true });
// // //   const page = await browser.newPage();
// // //   await page.goto(url, { waitUntil: 'domcontentloaded' });

// // //   try {
// // //     await page.waitForSelector('.css-1bqtg8z h1', { timeout: 60000 });

// // //     const data = await page.evaluate(() => {
// // //       const name = document.querySelector('.css-1bqtg8z h1').innerText.trim();
// // //       const address = document.querySelector('.css-106y4gv').innerText.trim();
// // //       const addressUrl = document.querySelector('.theatre_details-location').getAttribute('href');

// // //       return { name, address, addressUrl };
// // //     });

// // //     await browser.close();
// // //     return data;
// // //   } catch (error) {
// // //     console.error(`Error scraping data from ${url}:`, error);
// // //     await browser.close();
// // //     return null;
// // //   }
// // // }

// // // async function main() {
// // //   const filePath = './43.links.txt';
// // //   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

// // //   for (const url of urls) {
// // //     const data = await scrapeData(url);
// // //     if (data) {
// // //       console.log(`Data from ${url}:`);
// // //       console.log('Name:', data.name);
// // //       console.log('Address:', data.address);
// // //       console.log('Address URL:', data.addressUrl);
// // //       console.log('---');
// // //     }
// // //   }
// // // }

// // // main();


// // const fs = require('fs');
// // const puppeteer = require('puppeteer');

// // async function scrapeData(url, retries = 3) {
// //   const browser = await puppeteer.launch({ headless: true });
// //   const page = await browser.newPage();
// //   await page.goto(url, { waitUntil: 'domcontentloaded' });

// //   try {
// //     await page.waitForSelector('.css-1bqtg8z h1', { timeout: 60000 });

// //     const data = await page.evaluate(() => {
// //       const name = document.querySelector('.css-1bqtg8z h1').innerText.trim();
// //       const address = document.querySelector('.css-106y4gv').innerText.trim();
// //       const addressUrl = document.querySelector('.theatre_details-location').getAttribute('href');

// //       return { name, address, addressUrl };
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
// //   const filePath = './43.links.txt';
// //   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
// //   const results = [];

// //   for (const url of urls) {
// //     const data = await scrapeData(url);
// //     if (data) {
// //       console.log(`Data from ${url}:`);
// //       console.log('Name:', data.name);
// //       console.log('Address:', data.address);
// //       console.log('Address URL:', data.addressUrl);
// //       console.log('---');
// //       results.push({ url, ...data });
// //     }
// //   }

// //   fs.writeFileSync('./scraped_data.json', JSON.stringify(results, null, 2), 'utf-8');
// //   console.log('Data has been written to scraped_data.json');
// // }

// // main();




// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeData(url, retries = 3) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   try {
//     await page.waitForSelector('.css-1bqtg8z h1', { timeout: 60000 });

//     const data = await page.evaluate(() => {
//       const name = document.querySelector('.css-1bqtg8z h1').innerText.trim();
//       const address = document.querySelector('.css-106y4gv').innerText.trim();
//       const addressUrl = document.querySelector('.theatre_details-location').getAttribute('href');

//       return { name, address, addressUrl };
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
//   const filePath = './43.links.txt';
//   const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
//   const results = [];

//   for (const url of urls) {
//     let retries = 3;
//     let data = null;

//     while (retries > 0 && !data) {
//       data = await scrapeData(url, retries);
//       retries--;
//     }

//     if (data) {
//       console.log(`Data from ${url}:`);
//       console.log('Name:', data.name);
//       console.log('Address:', data.address);
//       console.log('Address URL:', data.addressUrl);
//       console.log('---');
//       results.push({ url, ...data });
//     } else {
//       console.error(`Skipping ${url} due to scraping errors.`);
//     }
//   }

//   fs.writeFileSync('./43.Data.json', JSON.stringify(results, null, 2), 'utf-8');
//   console.log('Data has been written to scraped_data.json');
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
    await page.waitForSelector('.css-1bqtg8z h1', { timeout: 60000 });

    const data = await page.evaluate(() => {
      const name = document.querySelector('.css-1bqtg8z h1').innerText.trim();
      const address = document.querySelector('.css-106y4gv').innerText.trim();
      const addressUrl = document.querySelector('.theatre_details-location').getAttribute('href');

      return { name, address, addressUrl };
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
  const filePath = './43.links.txt';
  const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  const results = [];

  for (const url of urls) {
    let retries = MAX_RETRIES;
    let data = null;
    console.log(`looking at ${url}`)

    while (retries > 0 && !data) {
      data = await scrapeData(url, retries);
      retries--;
    }

    if (data) {
      console.log(`Data from ${url}:`);
      console.log('Name:', data.name);
      console.log('Address:', data.address);
      console.log('Address URL:', data.addressUrl);
      console.log('---');
      results.push({ url, ...data });
    } else {
      console.error(`Skipping ${url} due to scraping errors.`);
    }
  }

  fs.writeFileSync('./scraped_data.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('Data has been written to scraped_data.json');
}

main();
