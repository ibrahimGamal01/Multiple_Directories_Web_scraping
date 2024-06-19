// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const path = require('path');

// // Path for the output files
// const linksFilePath = path.join(__dirname, '33.links.txt');
// const outputFilePath = path.join(__dirname, 'bowling_alleys_data.json');

// // Function to fetch and parse a single page
// async function fetchLinks(pageNumber) {
//     const url = `https://www.bowlingalleydirectory.com/united-states-of-america?page=${pageNumber}`;
//     try {
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
//         const links = [];

//         // Locate all links on the page
//         $('.grid_element a[title]').each((index, element) => {
//             const href = $(element).attr('href');
//             const fullLink = `https://www.bowlingalleydirectory.com${href}`;
//             links.push(fullLink);
//         });

//         return links;
//     } catch (error) {
//         console.error(`Error fetching page ${pageNumber}: ${error.message}`);
//         return [];
//     }
// }

// // Function to scrape details from each bowling alley link
// async function fetchDetails(url) {
//     try {
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
//         const details = {};

//         details.name = $('h1.bold.inline-block').text().trim();
//         details.address = $('.profile-header-location').text().trim();
//         details.phone = $('.myphoneHideDetail a').text().trim();
//         details.website = $('a[title="Website"]').attr('href');
//         details.email = $('a[title="Email"]').attr('href') ? $('a[title="Email"]').attr('href').replace('mailto:', '') : '';
//         details.socialMedia = {};
//         $('div.member_social_icons a').each((index, element) => {
//             const platform = $(element).attr('class').split(' ')[1].replace('weblink', '').trim();
//             details.socialMedia[platform] = $(element).attr('href');
//         });
//         details.hours = $('.textarea-rep_matters').text().trim();
//         details.paymentMethods = $('.textarea-affiliation').text().trim();
//         details.credentials = $('.textarea-credentials').text().trim();
//         details.awards = $('.textarea-awards').text().trim();
//         details.yearEstablished = $('.years-experience').text().trim();

//         return details;
//     } catch (error) {
//         console.error(`Error fetching details for ${url}: ${error.message}`);
//         return null;
//     }
// }

// // Main function to scrape all pages and save links to a single file
// async function scrapeAllPages() {
//     const allLinks = [];

//     for (let n = 1; n <= 43; n++) {
//         console.log(`Fetching page ${n}...`);
//         const links = await fetchLinks(n);
//         if (links.length > 0) {
//             allLinks.push(...links);
//             console.log(`Page ${n}: ${links.length} links extracted`);
//         } else {
//             console.log(`Page ${n}: No links found`);
//         }
//     }

//     // Save all links to a single file
//     fs.writeFileSync(linksFilePath, allLinks.join('\n'), 'utf8');
//     console.log(`Scraping complete. Links saved in "${linksFilePath}".`);
// }

// // Function to scrape details for all bowling alleys
// async function scrapeDetails() {
//     const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
//     const allDetails = [];

//     for (const link of links) {
//         console.log(`Fetching details for ${link}...`);
//         const details = await fetchDetails(link);
//         if (details) {
//             allDetails.push(details);
//             console.log(`Details fetched for ${link}`);
//         } else {
//             console.log(`Failed to fetch details for ${link}`);
//         }
//     }

//     // Save the detailed data to a JSON file
//     fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
//     console.log(`Detail scraping complete. Data saved in "${outputFilePath}".`);
// }

// // Execute the functions
// (async () => {
//     await scrapeAllPages();
//     await scrapeDetails();
// })();


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Paths for input and output files
const linksFilePath = path.join(__dirname, '33.links.txt');
const outputFilePath = path.join(__dirname, 'bowling_alleys_data.json');

// Function to scrape details from each bowling alley link
async function fetchDetails(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const details = {};

        details.name = $('h1.bold.inline-block').text().trim();
        details.address = $('.profile-header-location').text().trim();
        details.phone = $('.myphoneHideDetail a').text().trim();
        details.website = $('a[title="Website"]').attr('href');
        details.email = $('a[title="Email"]').attr('href') ? $('a[title="Email"]').attr('href').replace('mailto:', '') : '';
        details.socialMedia = {};
        $('div.member_social_icons a').each((index, element) => {
            const platform = $(element).attr('class').split(' ')[1].replace('weblink', '').trim();
            details.socialMedia[platform] = $(element).attr('href');
        });
        details.hours = $('.textarea-rep_matters').text().trim();
        details.paymentMethods = $('.textarea-affiliation').text().trim();
        details.credentials = $('.textarea-credentials').text().trim();
        details.awards = $('.textarea-awards').text().trim();
        details.yearEstablished = $('.years-experience').text().trim();

        return details;
    } catch (error) {
        console.error(`Error fetching details for ${url}: ${error.message}`);
        return null;
    }
}

// Function to scrape details for all bowling alleys
async function scrapeDetails() {
    // Read and process the links file
    const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
    const uniqueLinks = [...new Set(links)]; // Remove duplicate links
    const allDetails = [];

    for (const link of uniqueLinks) {
        console.log(`Fetching details for ${link}...`);
        const details = await fetchDetails(link);
        if (details) {
            allDetails.push(details);
            console.log(`Details fetched for ${link}`);
        } else {
            console.log(`Failed to fetch details for ${link}`);
        }
    }

    // Save the detailed data to a JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
    console.log(`Detail scraping complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
scrapeDetails();
