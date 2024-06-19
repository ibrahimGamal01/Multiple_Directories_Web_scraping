const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '58.locationLinks.txt');
const outputFilePath = path.join(__dirname, '58.Data.json');

// Function to fetch and parse details from each theme park page
async function fetchThemeParkDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        const name = $('h2 strong').first().text().replace(' Coupons, Savings and Theme Park Description for 2024', '').trim();
        const website = $('a[rel="noopener"]').attr('href');

        // Extract address
        let address = '';
        let addressStarted = false;

        $('#leftsidebar2').contents().each((index, element) => {
            if (addressStarted) {
                if ($(element).is('br') || $(element).is('h3')) return false; // Stop loop when <br> or next <h3> is encountered
                address += $(element).text() + '\n';
            } else if ($(element).text().trim() === 'Address:') {
                addressStarted = true;
            }
        });

        address = address.trim();

        console.log('Address:', address);


        // Extract overview
        const overview = $('h2 strong').parent().nextUntil('h3').text().trim();

        // Extract logo link
        const logoLink = $('img.logomobile').attr('data-src');

        return {
            name,
            website,
            address,
            overview,
            logoLink
        };
    } catch (error) {
        console.error(`Error fetching details from ${url}: ${error.message}`);
        return null;
    }
}

// Function to scrape all theme park details from the file 58.locationLinks.txt
async function scrapeThemeParkDetails() {
    const links = fs.readFileSync(inputFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const allDetails = [];

    for (const link of links) {
        console.log(`Fetching details from ${link}...`);
        const details = await fetchThemeParkDetails(link);
        if (details) {
            allDetails.push(details);
            console.log(`Fetched details for ${details.name}`);
        } else {
            console.log(`No details found for ${link}`);
        }
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
    console.log(`Theme park details scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeThemeParkDetails();
