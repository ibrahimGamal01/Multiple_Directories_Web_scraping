const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Read the list of links from 45.links.txt
const linksFile = '45.links.txt';
const links = fs.readFileSync(linksFile, 'utf-8').split('\n').filter(link => link && link.startsWith('https'));

// Function to scrape data from a given URL
async function scrapeData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const theaters = [];

    $('h4').each((index, element) => {
      const name = $(element).text().trim();

      const details = $(element).next('ul').children('li').map((i, el) => {
        const theaterInfo = $(el).text().trim().split('\n');
        const name1 = theaterInfo[0];
        const address = theaterInfo[1];

        return { name1, address };
      }).get();

      theaters.push({ name, details });
    });

    return theaters;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}

(async () => {
  const allTheaters = [];

  for (const link of links) {
    console.log(`Scraping data from ${link}...`);
    const theaters = await scrapeData(link);
    allTheaters.push(...theaters);
  }

  // Save the data to 45.Data.json
  fs.writeFileSync('45.Data.json', JSON.stringify(allTheaters, null, 2));
  console.log('Scraping completed. Data saved to 45.Data.json');
})();
