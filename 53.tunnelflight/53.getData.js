// const fs = require('fs');
// const puppeteer = require('puppeteer');

// const MAX_RETRIES = 3;

// async function scrapeData(url, retries = MAX_RETRIES) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.goto(url, { waitUntil: 'domcontentloaded' });
//     await page.waitForSelector('main.content h1.mb-3.with-logo', { timeout: 60000 });

//     const data = await page.evaluate(() => {
//       const name = document.querySelector('main.content h1.mb-3.with-logo').innerText.trim();
//       const addressElement = document.querySelector('main.content .tab-content .tab-pane.active .list-unstyled');
//       let address = '';
//       if (addressElement) {
//         address = addressElement.innerText.split('\n').map(line => line.trim()).filter(line => line).join(', ');
//       }

//       return { name, address };
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
//   const filePath = './53.links.txt';
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
//       console.log('Address:', data.address);
//       console.log('---');
//       results.push({ url, ...data });
//     } else {
//       console.error(`Skipping ${url} due to scraping errors.`);
//     }
//   }

//   fs.writeFileSync('./scraped_data.json', JSON.stringify(results, null, 2), 'utf-8');
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
    await page.waitForSelector('main.content h1.mb-3.with-logo', { timeout: 60000 });

    const data = await page.evaluate(() => {
      const name = document.querySelector('main.content h1.mb-3.with-logo').innerText.trim();
      const addressElement = document.querySelector('main.content .tab-content .tab-pane.active .list-unstyled');
      let address = '';
      if (addressElement) {
        address = addressElement.innerText.split('\n').map(line => line.trim()).filter(line => line).join(', ');
      }
      const imgLink = document.querySelector('main.content .tab-content .tab-pane.active img.img-fluid').src;

      return { name, address, imgLink };
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
  const filePath = './53.links.txt';
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
      console.log('Address:', data.address);
      console.log('Image Link:', data.imgLink);
      console.log('---');
      results.push({ url, ...data });
    } else {
      console.error(`Skipping ${url} due to scraping errors.`);
    }
  }

  fs.writeFileSync('./53.Data.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('Data has been written to scraped_data.json');
}

main();

