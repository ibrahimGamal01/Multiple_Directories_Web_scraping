const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const linksFilePath = path.join(__dirname, '34.locationLinks.txt');
const outputFilePath = path.join(__dirname, '34.Data.json');

// Function to fetch and parse details from each location page
async function fetchLocationDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const name = $('#details .name').text().trim();
        const address = {
            streetAddress: $('#details .streetAddress').text().trim(),
            locality: $('#details .addressLocality').text().trim(),
            region: $('#details .addressRegion').text().trim(),
            postalCode: $('#details .postalCode').text().trim(),
        };
        const phone = $('#details .telephone a').text().trim();
        const hours = $('#details .hours span').text().trim();
        const services = $('#details dd').last().text().trim();

        return { name, address, phone, hours, services, url };
    } catch (error) {
        console.error(`Error fetching details from ${url}: ${error.message}`);
        return null;
    }
}

// Function to scrape all location details from the file 34.locationLinks.txt
async function scrapeLocationDetails() {
    const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const allDetails = [];

    for (const link of links) {
        console.log(`Fetching details from ${link}...`);
        const details = await fetchLocationDetails(link);
        if (details) {
            allDetails.push(details);
            console.log(`Fetched details from ${link}`);
        } else {
            console.log(`No details found for ${link}`);
        }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
    console.log(`Location details scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeLocationDetails();
