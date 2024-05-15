const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function scrapeThemeParks(url) {
    const browser = await puppeteer.launch({ headless: true }); // Launch headless Chrome
    const page = await browser.newPage(); // Open a new page
    await page.goto(url); // Navigate to the URL

    const data = await page.evaluate(() => {
        const items = []; // Array to hold the scraped data
        const elements = document.querySelectorAll('.catItemTitle > a'); // Select all theme park links within titles

        for (let element of elements) { // Loop through each element
            const title = element.textContent.trim(); // Get the text content and trim whitespace
            const link = element.href; // Get the href attribute (URL)
            items.push({ title, link }); // Push an object with the title and link to the items array
        }

        return items; // Return the items array
    });

    await browser.close(); // Close the browser
    return data; // Return the scraped data
}

const themeParkUrl = 'https://www.themeparks-uk.com/uk-theme-parks';
scrapeThemeParks(themeParkUrl)
    .then(data => {
        const jsonData = JSON.stringify(data, null, 2); // Convert the data to a pretty JSON format
        return fs.writeFile('theme_parks.json', jsonData); // Write the JSON data to a file
    })
    .then(() => console.log('Data has been written to theme_parks.json')) // Log success message
    .catch(error => console.error('Failed to scrape and write data:', error)); // Log any errors
