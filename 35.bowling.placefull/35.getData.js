const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const linksFilePath = path.join(__dirname, '35.links.txt');
const outputFilePath = path.join(__dirname, '35.Data.json');

// Function to fetch and parse details from each link
async function fetchDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const name = $('.merchant-name').text().trim();
        const backgroundImage = $('.merchant-masthead .header').attr('style').match(/url\('(.+?)'\)/)[1];
        const address = $('.merchant-contact .adr').text().trim().replace(/\s+/g, ' ');
        const phone = $('#phone-number').text().trim();
        const overview = $('.merchant-about .merchant-contact span').first().text().trim();
        const website = $('a:contains("Visit Website")').attr('href');

        const details = {
            name,
            overview,
            backgroundImage,
            address,
            phone,
            website: website ? website : 'N/A'
        };

        return details;
    } catch (error) {
        console.error(`Error fetching details for ${url}: ${error.message}`);
        return null;
    }
}

// Function to scrape details for all links in 35.links.txt
async function scrapeDetails() {
    const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const allDetails = [];

    for (const link of links) {
        console.log(`Fetching details for ${link}...`);
        const details = await fetchDetails(link);
        if (details) {
            allDetails.push(details);
            console.log(`Details fetched for ${link}`);
        } else {
            console.log(`Failed to fetch details for ${link}`);
        }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
    console.log(`Detail scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeDetails();
