const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeRoomEscapeData(url) {
    const browser = await puppeteer.launch({ headless: false }); // Set headless to false to see the browser actions
    const page = await browser.newPage();

    // Set a higher timeout for the page load
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
        console.log('Page loaded successfully.');
    } catch (error) {
        console.error('Error loading page:', error);
        await browser.close();
        return;
    }

    // Wait for the iframe to be available
    try {
        await page.waitForSelector('iframe', { timeout: 60000 });
        console.log('Iframe found.');
    } catch (error) {
        console.error('Error waiting for iframe:', error);
        await browser.close();
        return;
    }

    // Get the iframe element
    const frameHandle = await page.$('iframe');
    const frame = await frameHandle.contentFrame();

    // Wait for the table inside the iframe to load
    const selector = '.v-data-table__wrapper table tbody tr';
    try {
        await frame.waitForSelector(selector, { timeout: 120000 });
        console.log('Table found.');
    } catch (error) {
        console.error('Error waiting for table selector:', error);
        await browser.close();
        return;
    }

    // Scroll to the bottom of the iframe to ensure all data is loaded
    try {
        await autoScroll(frame);
        console.log('Auto scroll completed.');
    } catch (error) {
        console.error('Error during auto scroll:', error);
        await browser.close();
        return;
    }

    // Extract data from the table inside the iframe
    try {
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
        console.error('Error extracting data:', error);
        await browser.close();
        return;
    }
}

// Function to auto scroll the iframe
async function autoScroll(frame) {
    await frame.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function main() {
    const url = 'https://roomescapeartist.com/find-a-room/';
    const data = await scrapeRoomEscapeData(url);

    if (data) {
        // Create an array of objects with appropriate keys
        const formattedData = data.map(row => ({
            company: row[0],
            city: row[1],
            region: row[2],
            country: row[3],
            // reviewed: row[4]
        }));

        const outputFilePath = '22.Data.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(formattedData, null, 2));
        console.log(`Room escape data has been written to ${outputFilePath}`);
    } else {
        console.log('No data to write.');
    }
}

main();
