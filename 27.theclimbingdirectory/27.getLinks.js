// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeClimbingDirectoryLinks(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Loop over clicking the "Load More" button until it's no longer visible
//         let loadMoreButton;
//         while (loadMoreButton === undefined || !loadMoreButton.isIntersectingViewport()) {
//             console.log('Clicking the "Load More" button...');
//             loadMoreButton = await page.$('.load_more_jobs');
//             if (loadMoreButton) {
//                 await loadMoreButton.click();
//                 await delay(12000); 
//             } else {
//                 console.log('No "Load More" button found or it is no longer visible.');
//                 break;
//             }
//         }

//         // Wait for the content to load after clicking "Load More"
//         console.log('Waiting for the additional content to load...');
//         await page.waitForSelector('.card--listing');

//         console.log('Scraping links...');
//         const links = await page.evaluate(() => {
//             const links = [];
//             const linkElements = document.querySelectorAll('.card--listing .card__link');
//             linkElements.forEach(link => {
//                 links.push(link.href);
//             });
//             return links;
//         });

//         await browser.close();
//         return links;
//     } catch (error) {
//         console.error('Error during scraping:', error);
//         await browser.close();
//         return null;
//     }
// }

// // Function to delay execution for a specified time
// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

// const url = 'https://theclimbingdirectory.co.uk/listings-with-map/?search_keywords=&search_region=0&search_categories%5B%5D=&submit=';
// const outputFile = 'climbing_directory_links.txt';

// scrapeClimbingDirectoryLinks(url)
//     .then(links => {
//         if (links) {
//             fs.writeFileSync(outputFile, links.join('\n'));
//             console.log(`Scraping completed. Links saved to ${outputFile}`);
//         } else {
//             console.log('No links scraped.');
//         }
//     })
//     .catch(error => console.error('Error:', error));


const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeClimbingDirectoryLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Loop over clicking the "Load More" button 40 times
        for (let i = 0; i < 235; i++) {
            console.log(`Clicking the "Load More" button - Attempt ${i + 1}...`);
            await delay(12000); // Wait before clicking again
            await page.click('.load_more_jobs');
        }

        // Wait for the content to load after clicking "Load More"
        console.log('Waiting for the additional content to load...');
        await page.waitForSelector('.card--listing');

        console.log('Scraping links...');
        const links = await page.evaluate(() => {
            const links = [];
            const linkElements = document.querySelectorAll('.card--listing .card__link');
            linkElements.forEach(link => {
                links.push(link.href);
            });
            return links;
        });

        await browser.close();
        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return null;
    }
}

// Function to delay execution for a specified time
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'https://theclimbingdirectory.co.uk/listings-with-map/?search_keywords=&search_region=0&search_categories%5B%5D=&submit=';
const outputFile = 'links.txt';

scrapeClimbingDirectoryLinks(url)
    .then(links => {
        if (links) {
            fs.writeFileSync(outputFile, links.join('\n'));
            console.log(`Scraping completed. Links saved to ${outputFile}`);
        } else {
            console.log('No links scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
