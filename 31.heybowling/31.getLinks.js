// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   const url = 'https://heybowling.com/Las_Vegas/';
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   const results = [];

//   async function scrapePage() {
//     return page.evaluate(() => {
//       const data = [];
//       const venueElements = document.querySelectorAll('.venues li');

//       venueElements.forEach(venue => {
//         const venueData = {};

//         const nameElement = venue.querySelector('h3 a');
//         if (nameElement) {
//           venueData.name = nameElement.innerText.trim();
//           venueData.link = nameElement.href;
//         }

//         const addressElement = venue.querySelector('.street');
//         if (addressElement) {
//           venueData.address = addressElement.innerText.trim();
//         }

//         const imageElement = venue.querySelector('.venue_image');
//         if (imageElement) {
//           venueData.image = imageElement.src;
//         }

//         const ratingElement = venue.querySelector('.grade_value');
//         if (ratingElement) {
//           venueData.rating = ratingElement.innerText.trim();
//         }

//         const subcategories = venue.querySelectorAll('.subcategory');
//         venueData.subcategories = Array.from(subcategories).map(sub => sub.innerText.trim());

//         const quoteElement = venue.querySelector('.rating_quote');
//         if (quoteElement) {
//           venueData.quote = quoteElement.innerText.trim();
//         }

//         data.push(venueData);
//       });

//       return data;
//     });
//   }

//   async function scrapeAllPages() {
//     let hasNextPage = true;

//     while (hasNextPage) {
//       const data = await scrapePage();
//       results.push(...data);

//       // Check if there is a next page link
//       const nextPageLink = await page.$('a.increase_radius');
//       if (nextPageLink) {
//         await Promise.all([
//           page.click('a.increase_radius'),
//           page.waitForNavigation({ waitUntil: 'networkidle2' }),
//         ]);
//       } else {
//         hasNextPage = false;
//       }
//     }
//   }

//   await scrapeAllPages();

//   await browser.close();

//   // Save results to a JSON file
//   fs.writeFileSync('scraped_bowling_data.json', JSON.stringify(results, null, 2));
//   console.log('Scraping completed. Data saved to scraped_bowling_data.json');
// })();


const fs = require('fs');
const puppeteer = require('puppeteer');

// Read URLs from file
const urls = fs.readFileSync('31.links.txt', 'utf-8').split('\n').filter(Boolean);

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const results = [];

    async function scrapePage() {
      return page.evaluate(() => {
        const data = [];
        const venueElements = document.querySelectorAll('.venues li');

        venueElements.forEach(venue => {
          const venueData = {};

          const nameElement = venue.querySelector('h3 a');
          if (nameElement) {
            venueData.name = nameElement.innerText.trim();
            venueData.link = nameElement.href;
          }

          const addressElement = venue.querySelector('.street');
          if (addressElement) {
            venueData.address = addressElement.innerText.trim();
          }

          const imageElement = venue.querySelector('.venue_image');
          if (imageElement) {
            venueData.image = imageElement.src;
          }

          const ratingElement = venue.querySelector('.grade_value');
          if (ratingElement) {
            venueData.rating = ratingElement.innerText.trim();
          }

          const subcategories = venue.querySelectorAll('.subcategory');
          venueData.subcategories = Array.from(subcategories).map(sub => sub.innerText.trim());

          const quoteElement = venue.querySelector('.rating_quote');
          if (quoteElement) {
            venueData.quote = quoteElement.innerText.trim();
          }

          data.push(venueData);
        });

        return data;
      });
    }

    async function scrapeAllPages() {
      let hasNextPage = true;

      while (hasNextPage) {
        const data = await scrapePage();
        results.push(...data);

        // Check if there is a next page link
        const nextPageLink = await page.$('a.increase_radius');
        if (nextPageLink) {
          await Promise.all([
            page.click('a.increase_radius'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
          ]);
        } else {
          hasNextPage = false;
        }
      }
    }

    await scrapeAllPages();
    await page.close();

    // Save results to a JSON file named after the city
    const city = url.split('/')[3] || 'unknown_city';
    fs.writeFileSync(`scraped_data_${city}.json`, JSON.stringify(results, null, 2));
    console.log(`Scraping completed for ${url}. Data saved to scraped_data_${city}.json`);
  }

  await browser.close();
})();
