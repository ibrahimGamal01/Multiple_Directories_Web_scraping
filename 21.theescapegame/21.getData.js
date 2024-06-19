// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
  
//   // Read URLs from file
//   const urls = fs.readFileSync('21.links.txt', 'utf-8').split('\n').filter(Boolean);
  
//   // Function to scrape data from a given URL
//   async function scrapePage(url) {
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     return page.evaluate(() => {
//       const data = {};

//       const container = document.querySelector('.tw-grid.tw-grid-cols-1.md\\:tw-grid-cols-11.tw-p-6.md\\:tw-p-12.tw-border-2.tw-border-black.tw-rounded-3xl');
//       if (!container) return null;

//       data.locationName = container.querySelector('h4')?.innerText.trim();
//       data.address = container.querySelector('address a')?.innerText.trim();
//       data.phone = container.querySelector('a[href^="tel:"]')?.innerText.trim();

//       const gamesAvailableElement = container.querySelector('.fw-700');
//       if (gamesAvailableElement && gamesAvailableElement.innerText.trim() === 'Games available:') {
//         data.gamesAvailable = gamesAvailableElement.nextElementSibling?.innerText.trim();
//       }

//       const description = container.querySelector('.description.tw-mb-8.tw-leading-7');
//       if (description) {
//         data.description = Array.from(description.querySelectorAll('p')).map(p => p.innerText.trim()).join('\n\n');
//       }

//       return data;
//     });
//   }

//   const results = [];

//   for (const url of urls) {
//     console.log(`Scraping ${url}`);
//     try {
//       const data = await scrapePage(url);
//       if (data) {
//         results.push(data);  // Add only the data object to the results array
//       } else {
//         console.log(`No data found for ${url}`);
//       }
//     } catch (error) {
//       console.error(`Error scraping ${url}:`, error);
//     }
//   }

//   await browser.close();

//   // Save results to a JSON file
//   fs.writeFileSync('scraped_data.json', JSON.stringify(results, null, 2));
//   console.log('Scraping completed. Data saved to scraped_data.json');
// })();



const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Read URLs from file
  const urls = fs.readFileSync('21.links.txt', 'utf-8').split('\n').filter(Boolean);
  
  // Function to scrape data from a given URL
  async function scrapePage(url) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    return page.evaluate(() => {
      const data = {};

      const container = document.querySelector('.tw-grid.tw-grid-cols-1.md\\:tw-grid-cols-11.tw-p-6.md\\:tw-p-12.tw-border-2.tw-border-black.tw-rounded-3xl');
      if (!container) return null;

      // Get location name
      data.locationName = container.querySelector('h4')?.innerText.trim();

      // Get address
      const addressElement = container.querySelector('address a');
      if (addressElement) {
        data.address = addressElement.innerText.trim().replace(/<!-- -->/g, ' ');
      }

      // Get phone number
      data.phone = container.querySelector('a[href^="tel:"]')?.innerText.trim();

      // Get games available
      const gamesAvailableElement = container.querySelector('.fw-700');
      if (gamesAvailableElement && gamesAvailableElement.innerText.trim() === 'Games available:') {
        data.gamesAvailable = gamesAvailableElement.nextElementSibling?.innerText.trim().replace(/<!-- -->/g, ' ');
      }

      // Get description
      const description = container.querySelector('.description.tw-mb-8.tw-leading-7');
      if (description) {
        data.description = Array.from(description.querySelectorAll('p')).map(p => p.innerText.trim()).join('\n\n');
      }

      // Get all links
      data.links = Array.from(document.querySelectorAll('a')).map(link => link.href);

      return data;
    });
  }

  const results = [];

  for (const url of urls) {
    console.log(`Scraping ${url}`);
    try {
      const data = await scrapePage(url);
      if (data) {
        results.push(data);  // Add only the data object to the results array
      } else {
        console.log(`No data found for ${url}`);
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }

  await browser.close();

  // Save results to a JSON file
  fs.writeFileSync('scraped_data.json', JSON.stringify(results, null, 2));
  console.log('Scraping completed. Data saved to scraped_data.json');
})();
