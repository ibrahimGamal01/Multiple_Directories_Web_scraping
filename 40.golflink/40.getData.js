// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapeGolfCourses(url) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: 'domcontentloaded' });

//   const golfCourses = await page.evaluate(() => {
//     const courses = [];
//     const courseCards = document.querySelectorAll('.course-card');

//     courseCards.forEach(card => {
//       const titleElement = card.querySelector('.title h3 a');
//       const typeElement = card.querySelector('.title span');
//       const yearOpenedElement = card.querySelector('.opened');
//       const addressElement = card.querySelector('.address .text span');
//       const distanceElement = card.querySelector('.address .text i');
//       const holesElement = card.querySelector('.highlights .info:nth-child(1) .text');
//       const parElement = card.querySelector('.highlights .info:nth-child(2) .text');
//       const yardsElement = card.querySelector('.highlights .info:nth-child(3) .text');
//       const drivingRangeElement = card.querySelector('.highlights .info:nth-child(4) .text');

//       const course = {
//         title: titleElement ? titleElement.textContent.trim() : '',
//         type: typeElement ? typeElement.textContent.trim() : '',
//         yearOpened: yearOpenedElement ? yearOpenedElement.textContent.replace('Year Opened: ', '').trim() : '',
//         address: addressElement ? addressElement.textContent.trim() : '',
//         distanceFromCenter: distanceElement ? distanceElement.textContent.trim() : '',
//         holes: holesElement ? holesElement.textContent.trim() : '',
//         par: parElement ? parElement.textContent.trim() : '',
//         yards: yardsElement ? yardsElement.textContent.trim() : '',
//         drivingRange: drivingRangeElement ? drivingRangeElement.textContent.replace('Driving Range: ', '').trim() : ''
//       };

//       courses.push(course);
//     });

//     return courses;
//   });

//   await browser.close();
//   return golfCourses;
// }

// (async () => {
//   // Read the URLs from 40.locations.txt
//   const locationsFile = '40.locations.txt';
//   const urls = fs.readFileSync(locationsFile, 'utf-8').split('\n').filter(Boolean);

//   const allGolfCourses = [];

//   for (const url of urls) {
//     console.log(`Scraping ${url}...`);
//     const golfCourses = await scrapeGolfCourses(url);
//     allGolfCourses.push(...golfCourses);
//   }

//   // Save the results to 40.golf_courses.json
//   fs.writeFileSync('40.golf_courses.json', JSON.stringify(allGolfCourses, null, 2));
//   console.log('Scraping completed. Data saved to 40.golf_courses.json');
// })();


const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeGolfCourses(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const golfCourses = await page.evaluate(() => {
      const courses = [];
      const courseCards = document.querySelectorAll('.course-card');

      courseCards.forEach(card => {
        const titleElement = card.querySelector('.title h3 a');
        const typeElement = card.querySelector('.title span');
        const yearOpenedElement = card.querySelector('.opened');
        const addressElement = card.querySelector('.address .text span');
        const distanceElement = card.querySelector('.address .text i');
        const holesElement = card.querySelector('.highlights .info:nth-child(1) .text');
        const parElement = card.querySelector('.highlights .info:nth-child(2) .text');
        const yardsElement = card.querySelector('.highlights .info:nth-child(3) .text');
        const drivingRangeElement = card.querySelector('.highlights .info:nth-child(4) .text');

        const course = {
          title: titleElement ? titleElement.textContent.trim() : '',
          type: typeElement ? typeElement.textContent.trim() : '',
          yearOpened: yearOpenedElement ? yearOpenedElement.textContent.replace('Year Opened: ', '').trim() : '',
          address: addressElement ? addressElement.textContent.trim() : '',
          distanceFromCenter: distanceElement ? distanceElement.textContent.trim() : '',
          holes: holesElement ? holesElement.textContent.trim() : '',
          par: parElement ? parElement.textContent.trim() : '',
          yards: yardsElement ? yardsElement.textContent.trim() : '',
          drivingRange: drivingRangeElement ? drivingRangeElement.textContent.replace('Driving Range: ', '').trim() : ''
        };

        courses.push(course);
      });

      return courses;
    });

    await browser.close();
    return golfCourses;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    await browser.close();
    return [];
  }
}

(async () => {
  // Read the URLs from 40.locations.txt and clean them
  const locationsFile = '40.locations.txt';
  const urls = fs.readFileSync(locationsFile, 'utf-8').split('\n').filter(url => url && url.startsWith('http'));

  const allGolfCourses = [];

  for (const url of urls) {
    console.log(`Scraping ${url}...`);
    const golfCourses = await scrapeGolfCourses(url);
    allGolfCourses.push(...golfCourses);
  }

  // Save the results to 40.golf_courses.json
  fs.writeFileSync('40.golf_courses.json', JSON.stringify(allGolfCourses, null, 2));
  console.log('Scraping completed. Data saved to 40.golf_courses.json');
})();
