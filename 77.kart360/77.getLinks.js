// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto('https://kart360.com/directory');
//   await page.waitForSelector('.ais-InfiniteHits-item');

//   const links = await page.evaluate(() => {
//     const linkElements = Array.from(document.querySelectorAll('.ais-InfiniteHits-item a'));
//     return linkElements.map(link => link.href);
//   });

//   console.log(links);

//   await browser.close();
// })();


// // // // const fs = require('fs');
// // // // const puppeteer = require('puppeteer');

// // // // async function scrapeLinks() {
// // // //     const browser = await puppeteer.launch();
// // // //     const page = await browser.newPage();

// // // //     try {
// // // //         // Navigate to the website
// // // //         await page.goto('https://kart360.com/directory');

// // // //         let links = [];

// // // //         while (true) {
// // // //             // Wait for the "Show more results" button to be visible
// // // //             const showMoreButton = await page.waitForSelector('.ais-InfiniteHits-loadMore', { visible: true, timeout: 5000 });

// // // //             // Check if the button is clickable
// // // //             const isClickable = await showMoreButton.isIntersectingViewport();
// // // //             if (isClickable) {
// // // //                 // Click the "Show more results" button
// // // //                 await showMoreButton.click();

// // // //                 // Wait for the new content to load
// // // //                 await page.waitForFunction(() => document.querySelectorAll('.ais-InfiniteHits-item').length > 1);
// // // //             } else {
// // // //                 break; // Exit the loop if the button is not clickable
// // // //             }
// // // //         }

// // // //         // Extract links from the current page
// // // //         links = await page.evaluate(() => {
// // // //             const linkElements = document.querySelectorAll('.ais-InfiniteHits-item a');
// // // //             return Array.from(linkElements, link => link.href);
// // // //         });

// // // //         // Save the links to links.txt
// // // //         fs.writeFileSync('links.txt', links.join('\n'));
// // // //         console.log('Links saved to links.txt');

// // // //     } catch (error) {
// // // //         console.error('Error scraping links:', error);
// // // //     } finally {
// // // //         await browser.close();
// // // //     }
// // // // }

// // // // // Call the function to start scraping
// // // // scrapeLinks();


// // // const fs = require('fs');
// // // const puppeteer = require('puppeteer');

// // // async function scrapeLinks() {
// // //     const browser = await puppeteer.launch({ headless: false });
// // //     const page = await browser.newPage();

// // //     try {
// // //         // Navigate to the website
// // //         await page.goto('https://kart360.com/directory');

// // //         let loadMoreButton = await page.$('.ais-InfiniteHits-loadMore');

// // //         // Define the number of times you want to click the button
// // //         const maxClicks = 5;
// // //         let clickCount = 0;

// // //         while (loadMoreButton && clickCount < maxClicks) {
// // //             // Click the "Show more results" button
// // //             await page.click('.ais-InfiniteHits-loadMore');

// // //             // Wait for the new content to load
// // //             await page.waitForFunction(() => document.querySelectorAll('.ais-InfiniteHits-item').length > 1);

// // //             // Update the loadMoreButton variable
// // //             loadMoreButton = await page.$('.ais-InfiniteHits-loadMore');

// // //             clickCount++;
// // //         }

// // //         // Extract links from the current page
// // //         const links = await page.evaluate(() => {
// // //             const linkElements = document.querySelectorAll('.ais-InfiniteHits-item a');
// // //             return Array.from(linkElements, link => link.href);
// // //         });

// // //         // Save the links to links.txt
// // //         fs.writeFileSync('links.txt', links.join('\n'));
// // //         console.log('Links saved to links.txt');

// // //     } catch (error) {
// // //         console.error('Error scraping links:', error);
// // //     } finally {
// // //         // Uncomment the line below if you want to keep the browser open after scraping
// // //         // await page.waitForTimeout(60000); // Wait for 60 seconds before closing
// // //         await browser.close();
// // //     }
// // // }

// // // // Call the function to start scraping
// // // scrapeLinks();


// // const fs = require('fs');
// // const puppeteer = require('puppeteer');

// // async function scrapeLinks() {
// //     const browser = await puppeteer.launch({ headless: false });
// //     const page = await browser.newPage();

// //     try {
// //         // Navigate to the website
// //         await page.goto('https://kart360.com/directory');

// //         // Define the number of times you want to click the "Show more results" button
// //         const maxClicks = 6;
// //         let clickCount = 0;

// //         while (clickCount < maxClicks) {
// //             // Wait for the "Show more results" button to be visible
// //             await page.waitForSelector('.ais-InfiniteHits-loadMore', { visible: true });
// //             await delay(5000);

// //             // Click the "Show more results" button
// //             await page.click('.ais-InfiniteHits-loadMore');

// //             // Wait for the new content to load
// //             await page.waitForFunction(() => document.querySelectorAll('.ais-InfiniteHits-item').length > (clickCount + 1) * 2);

// //             clickCount++;
// //         }

// //         // Extract links from the current page
// //         const links = await page.evaluate(() => {
// //             const linkElements = document.querySelectorAll('.ais-InfiniteHits-item a');
// //             return Array.from(linkElements, link => link.href);
// //         });

// //         // Save the links to links.txt
// //         fs.writeFileSync('links.txt', links.join('\n'));
// //         console.log('Links saved to links.txt');

// //     } catch (error) {
// //         console.error('Error scraping links:', error);
// //     } finally {
// //         // Uncomment the line below if you want to keep the browser open after scraping
// //         // await page.waitForTimeout(60000); // Wait for 60 seconds before closing
// //         await browser.close();
// //     }
// // }

// // // Call the function to start scraping
// // scrapeLinks();


const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeKart360Links(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url);
        await page.waitForSelector('.ais-InfiniteHits-item');

        // Loop over clicking "Show more results" button
        let numClicks = 0;
        while (true) {
            console.log(`Clicking "Show more results" - Attempt ${numClicks + 1}...`);
            await page.click('.ais-InfiniteHits-loadMore');
            await delay(5000);
            await page.waitForSelector('.ais-InfiniteHits-item', { timeout: 30000 }).catch(() => {
                console.log('No more results to load.');
            });
            numClicks++;

            // Exit loop if no more results or after 3 clicks
            if (numClicks >= 15) {
                break;
            }
        }

        console.log('Scraping links...');
        const links = await page.evaluate(() => {
            const linkElements = Array.from(document.querySelectorAll('.ais-InfiniteHits-item a'));
            return linkElements.map(link => link.href);
        });

        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        return null;
    } finally {
        await browser.close();
    }
}

// Function to delay execution for a specified time
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const url = 'https://kart360.com/directory';
const outputFile = 'links.txt';

scrapeKart360Links(url)
    .then(links => {
        if (links && links.length > 0) {
            fs.writeFileSync(outputFile, links.join('\n'));
            console.log(`Scraping completed. Links saved to ${outputFile}`);
        } else {
            console.log('No links scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
