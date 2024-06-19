// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const path = require('path');

// // Paths for input and output files
// const linksFilePath = path.join(__dirname, '31.links.txt');
// const outputFilePath = path.join(__dirname, 'heybowling_data.json');

// // Function to scrape details from each bowling alley link
// async function fetchDetails(url) {
//     try {
//         const { data } = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//             }
//         });
//         const $ = cheerio.load(data);
//         const details = {
//             name: '',
//             address: '',
//             details: '',
//             contact: {
//                 phone: '',
//                 website: '',
//                 facebook: ''
//             }
//         };

//         // Extract name
//         details.name = $('h1.fn').text().trim();

//         // Extract address
//         details.address = $('.ca_content_info .adr').first().text().trim();

//         // Extract details
//         details.details = $('.ca_description').text().trim();

//         // Extract phone number
//         details.contact.phone = $('.ca_content_info').find('div[itemprop="telephone"]').text().trim();

//         // Extract website
//         const websiteElement = $('.ca_content_info').find('a[rel="nofollow"]');
//         websiteElement.each((i, elem) => {
//             const href = $(elem).attr('href');
//             if (href.includes('http') && href.includes('silvernuggetlv.com')) {
//                 details.contact.website = href;
//             }
//         });

//         // Extract Facebook link
//         const facebookElement = $('.ca_content_info').find('a[rel="nofollow"]');
//         facebookElement.each((i, elem) => {
//             const href = $(elem).attr('href');
//             if (href.includes('facebook.com')) {
//                 details.contact.facebook = href;
//             }
//         });

//         return details;
//     } catch (error) {
//         console.error(`Error fetching details for ${url}: ${error.message}`);
//         return null;
//     }
// }

// // Function to scrape details for all bowling alleys
// async function scrapeDetails() {
//     // Read and process the links file
//     const links = fs.readFileSync(linksFilePath, 'utf8').split('\n').filter(link => link.trim() !== '');
//     const uniqueLinks = [...new Set(links)]; // Remove duplicate links
//     const allDetails = [];

//     for (const link of uniqueLinks) {
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

// // Execute the function
// scrapeDetails();


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Paths for input and output files
const linksFilePath = path.join(__dirname, '31.links.json');
const outputFilePath = path.join(__dirname, 'heybowling_data_combined.json');

// Function to scrape details from each bowling alley link
async function fetchDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const details = {
            name: '',
            address: '',
            details: '',
            contact: {
                phone: '',
                website: '',
                facebook: ''
            }
        };

        // Extract name
        details.name = $('h1.fn').text().trim();

        // Extract address
        details.address = $('.ca_content_info .adr').first().text().trim();

        // Extract details
        details.details = $('.ca_description').text().trim();

        // Extract phone number
        details.contact.phone = $('.ca_content_info').find('div[itemprop="telephone"]').text().trim();

        // Extract website
        const websiteElement = $('.ca_content_info').find('a[rel="nofollow"]');
        websiteElement.each((i, elem) => {
            const href = $(elem).attr('href');
            if (href.includes('http') && href.includes('silvernuggetlv.com')) {
                details.contact.website = href;
            }
        });

        // Extract Facebook link
        const facebookElement = $('.ca_content_info').find('a[rel="nofollow"]');
        facebookElement.each((i, elem) => {
            const href = $(elem).attr('href');
            if (href.includes('facebook.com')) {
                details.contact.facebook = href;
            }
        });

        return details;
    } catch (error) {
        console.error(`Error fetching details for ${url}: ${error.message}`);
        return null;
    }
}

// Function to read links from 31.links.json and combine information
async function combineDetails() {
    // Read and process the links file
    const linksData = fs.readFileSync(linksFilePath, 'utf8');
    const links = JSON.parse(linksData);
    const allDetails = [];

    for (const linkData of links) {
        const { name, link, address, image, rating, subcategories } = linkData;
        console.log(`Processing link: ${link}`);

        // Scrape details
        const details = await fetchDetails(link);
        if (details) {
            const combinedDetails = {
                name,
                address,
                image,
                rating,
                subcategories,
                details,
                contact: details.contact
            };
            allDetails.push(combinedDetails);
            console.log(`Details combined for ${link}`);
        } else {
            console.log(`Failed to fetch details for ${link}`);
        }
    }

    // Save the combined data to a JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(allDetails, null, 2), 'utf8');
    console.log(`Combination complete. Data saved in "${outputFilePath}".`);
}

// Execute the function
combineDetails();
