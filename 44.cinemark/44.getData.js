const fs = require('fs');
const puppeteer = require('puppeteer');

const MAX_RETRIES = 3;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Read URLs from the file
  const urls = fs.readFileSync('44.links.txt', 'utf8').split('\n').filter(url => url.trim() !== '');

  const data = [];

  for (const url of urls) {
    let retries = 0;
    let success = false;
    let error = null;

    while (retries < MAX_RETRIES && !success) {
      try {
        await page.goto(url);

        console.log(url);

        // const name = url.split('/').pop().replace(/-/g, ' ').toUpperCase();
        const name = url.split('#')[0].split('/').pop().replace(/-/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

        const address = await page.evaluate(() => {
          return document.querySelector('.addressBody').innerText.trim();
        });

        const phone = await page.evaluate(() => {
          return document.querySelector('.right').innerText.trim().split('\n')[0];
        });

        const email = await page.evaluate(() => {
          return document.querySelector('.right a[href^="mailto:"]').innerText.trim();
        });

        data.push({ name, address, phone, email });
        success = true;
      } catch (err) {
        error = err;
        retries++;
        console.error(`Error fetching data from ${url}. Retrying (${retries}/${MAX_RETRIES})...`);
      }
    }

    if (!success) {
      console.error(`Failed to fetch data from ${url} after ${MAX_RETRIES} retries. Skipping.`);
      if (error) {
        console.error('Error details:', error);
      }
    }
  }

  // Export data as JSON
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('44.Data.json', jsonData);

  console.log('Data extracted and saved as theater_data.json');

  await browser.close();
})();
