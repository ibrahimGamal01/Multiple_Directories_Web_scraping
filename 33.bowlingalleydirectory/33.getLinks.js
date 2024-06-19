// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');
// const path = require('path');

// // Create a directory to save the output files
// const outputDir = 'bowling_links';
// if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir);
// }

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

// // Function to save links to a text file
// function saveLinksToFile(links, pageNumber) {
//     const filePath = path.join(outputDir, `${pageNumber}.links.txt`);
//     fs.writeFileSync(filePath, links.join('\n'), 'utf8');
// }

// // Main function to scrape all pages
// async function scrapeAllPages() {
//     for (let n = 1; n <= 43; n++) {
//         console.log(`Fetching page ${n}...`);
//         const links = await fetchLinks(n);
//         if (links.length > 0) {
//             saveLinksToFile(links, n);
//             console.log(`Page ${n}: ${links.length} links extracted`);
//         } else {
//             console.log(`Page ${n}: No links found`);
//         }
//     }
//     console.log('Scraping complete. Links saved in the "bowling_links" directory.');
// }

// scrapeAllPages();


const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Path for the output file
const outputFilePath = path.join(__dirname, '33.links.txt');

// Function to fetch and parse a single page
async function fetchLinks(pageNumber) {
    const url = `https://www.bowlingalleydirectory.com/united-states-of-america?page=${pageNumber}`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links = [];

        // Locate all links on the page
        $('.grid_element a[title]').each((index, element) => {
            const href = $(element).attr('href');
            const fullLink = `https://www.bowlingalleydirectory.com${href}`;
            links.push(fullLink);
        });

        return links;
    } catch (error) {
        console.error(`Error fetching page ${pageNumber}: ${error.message}`);
        return [];
    }
}

// Main function to scrape all pages and save links to a single file
async function scrapeAllPages() {
    const allLinks = [];

    for (let n = 1; n <= 43; n++) {
        console.log(`Fetching page ${n}...`);
        const links = await fetchLinks(n);
        if (links.length > 0) {
            allLinks.push(...links);
            console.log(`Page ${n}: ${links.length} links extracted`);
        } else {
            console.log(`Page ${n}: No links found`);
        }
    }

    // Save all links to a single file
    fs.writeFileSync(outputFilePath, allLinks.join('\n'), 'utf8');
    console.log(`Scraping complete. Links saved in "${outputFilePath}".`);
}

scrapeAllPages();
