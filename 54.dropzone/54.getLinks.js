const fs = require('fs');
const puppeteer = require('puppeteer');

const MAX_RETRIES = 3;

async function extractLinks(url, retries = MAX_RETRIES) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.mobile-text-swell.tablet-text-swell.ipsType_blendLinks', { timeout: 60000 });

    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.mobile-text-swell.tablet-text-swell.ipsType_blendLinks'))
        .map(link => link.href);
    });

    await browser.close();
    return links;
  } catch (error) {
    console.error(`Error extracting links from ${url}:`, error);
    await browser.close();

    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      return extractLinks(url, retries - 1);
    } else {
      console.error(`Failed to extract links from ${url} after multiple attempts.`);
      return null;
    }
  }
}

async function main() {
  const filePath = './54.links.txt';
  const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
  const allLinks = [];

  for (const url of urls) {
    let retries = MAX_RETRIES;
    let links = null;

    while (retries > 0 && !links) {
      links = await extractLinks(url, retries);
      retries--;
    }

    if (links) {
      console.log(`Links from ${url}:`);
      console.log(links);
      console.log('---');
      allLinks.push(...links);
    } else {
      console.error(`Skipping ${url} due to extraction errors.`);
    }
  }

  fs.writeFileSync('./locations.txt', allLinks.join('\n'), 'utf-8');
  console.log('Links have been written to locations.txt');
}

main();
