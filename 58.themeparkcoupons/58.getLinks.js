const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '58.links.txt');
const outputFilePath = path.join(__dirname, '58.locationLinks.txt');

// Function to fetch and parse location links from each state page
async function fetchLocationLinks(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const links = [];

        $('.entry-content a').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                const fullUrl = new URL(href, url).href;
                links.push(fullUrl);
            }
        });

        return links;
    } catch (error) {
        console.error(`Error fetching links from ${url}: ${error.message}`);
        return [];
    }
}

// Function to scrape all location links from the file 58.links.txt
async function scrapeLocationLinks() {
    const links = fs.readFileSync(inputFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const allLinks = [];

    for (const link of links) {
        console.log(`Fetching links from ${link}...`);
        const locationLinks = await fetchLocationLinks(link);
        if (locationLinks.length > 0) {
            allLinks.push(...locationLinks);
            console.log(`Fetched ${locationLinks.length} links from ${link}`);
        } else {
            console.log(`No links found for ${link}`);
        }
    }

    fs.writeFileSync(outputFilePath, allLinks.join('\n'), 'utf8');
    console.log(`Location links scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeLocationLinks();
