const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const linksFilePath = path.join(__dirname, '34.links.txt');
const outputFilePath = path.join(__dirname, '34.locationLinks.txt');

// Function to fetch and parse links from each main page
async function fetchLocationLinks(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const links = [];
        $('.condensed-listing .title a').each((index, element) => {
            const relativeLink = $(element).attr('href');
            if (relativeLink) {
                const fullLink = new URL(relativeLink, 'https://www.bowling-alleys.com').href;
                links.push(fullLink);
            }
        });

        return links;
    } catch (error) {
        console.error(`Error fetching links from ${url}: ${error.message}`);
        return [];
    }
}

// Function to scrape all location links from the file 34.links.txt
async function scrapeLocationLinks() {
    const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const allLocationLinks = [];

    for (const link of links) {
        console.log(`Fetching location links from ${link}...`);
        const locationLinks = await fetchLocationLinks(link);
        if (locationLinks.length > 0) {
            allLocationLinks.push(...locationLinks);
            console.log(`Fetched ${locationLinks.length} location links from ${link}`);
        } else {
            console.log(`No location links found for ${link}`);
        }
    }

    fs.writeFileSync(outputFilePath, allLocationLinks.join('\n'), 'utf8');
    console.log(`Location links scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeLocationLinks();
