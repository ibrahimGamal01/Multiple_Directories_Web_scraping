const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeRoomEscapeData(url, retryLimit = 3) {
    let browser;
    let attempt = 0;

    while (attempt < retryLimit) {
        try {
            browser = await puppeteer.launch({ headless: false }); // Set headless to true to run in headless mode
            const page = await browser.newPage();

            // Set a higher timeout for the page load
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
            console.log('Page loaded successfully.');

            // Wait for the iframe to be available
            await page.waitForSelector('iframe', { timeout: 60000 });
            console.log('Iframe found.');

            // Get the iframe element
            const frameHandle = await page.$('iframe');
            const frame = await frameHandle.contentFrame();

            // Wait for the table inside the iframe to load
            const selector = '.v-data-table__wrapper table tbody tr';
            await frame.waitForSelector(selector, { timeout: 120000 });
            console.log('Table found.');

            // Scroll to the bottom of the iframe to ensure all data is loaded
            await autoScroll(frame);
            console.log('Auto scroll completed.');

            // Extract data from the table inside the iframe
            const data = await frame.evaluate((selector) => {
                const rows = document.querySelectorAll(selector);
                const rowData = [];

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const cellData = [];

                    cells.forEach(cell => {
                        cellData.push(cell.innerText.trim());
                    });

                    rowData.push(cellData);
                });

                return rowData;
            }, selector);

            console.log('Data extraction completed.');
            await browser.close();
            return data;

        } catch (error) {
            if (browser) {
                await browser.close();
            }
            console.error(`Attempt ${attempt + 1} failed:`, error);
            attempt++;
        }
    }

    throw new Error(`Failed to extract data from ${url} after ${retryLimit} attempts`);
}

// Function to auto scroll the iframe
async function autoScroll(frame) {
    await frame.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function main() {
    const url = 'https://roomescapeartist.com/find-a-room/';
    try {
        const data = await scrapeRoomEscapeData(url);

        if (data) {
            // Create an array of objects with appropriate keys
            const formattedData = data.map(row => ({
                company: row[0],
                city: row[1],
                region: row[2],
                country: row[3],
                reviewed: row[4]  // Uncomment and adjust based on actual data structure
            }));

            const outputFilePath = '22.Data.json';
            fs.writeFileSync(outputFilePath, JSON.stringify(formattedData, null, 2));
            console.log(`Room escape data has been written to ${outputFilePath}`);
        } else {
            console.log('No data to write.');
        }
    } catch (error) {
        console.error('Error during main execution:', error);
    }
}

main();
