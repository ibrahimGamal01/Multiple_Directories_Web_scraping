const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeTheatreLinks(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  try {
    await page.waitForSelector('.theatres-by-state', { timeout: 60000 });

    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('.theatres-by-state a');
      const baseURL = 'https://www.cinemark.com';
      const linksArray = [];

      linkElements.forEach(link => {
        linksArray.push(baseURL + link.getAttribute('href'));
      });

      return linksArray;
    });

    await browser.close();
    return links;
  } catch (error) {
    console.error(`Error scraping links from ${url}:`, error);
    await browser.close();
    return [];
  }
}

async function main() {
  const url = 'https://www.cinemark.com/full-theatre-list';
  const links = await scrapeTheatreLinks(url);

  if (links.length > 0) {
    fs.writeFileSync('./44.links.txt', links.join('\n'), 'utf-8');
    console.log('Links have been written to 44.links.txt');
  } else {
    console.log('No links were found.');
  }
}

main();
