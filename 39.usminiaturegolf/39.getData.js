const fs = require('fs');
const puppeteer = require('puppeteer');

// Function to extract bowling centers from a single URL
async function extractBowlingCenters(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

        console.log('Extracting bowling center information...');

        const data = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('#table3 tr'));
            const bowlingCenters = [];

            tableRows.forEach(row => {
                const cell = row.querySelector('td p span');
                if (cell) {
                    const info = cell.textContent.trim();
                    if (info) {
                        bowlingCenters.push({ info });
                    }
                }
            });

            return bowlingCenters;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during extraction:', error);
        await browser.close();
        throw error;
    }
}

// Function to extract bowling centers from multiple URLs listed in a file
async function extractFromMultipleURLs(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        const results = [];

        for (const url of urls) {
            const data = await extractBowlingCenters(url);
            results.push(...data); // Merge data into results array
        }

        return results;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    }
}

// Main function to run the extraction and save data to a JSON file
(async function main() {
    const inputFile = 'links.txt';

    try {
        const info = await extractFromMultipleURLs(inputFile);
        const outputFile = 'output.json';
        fs.writeFileSync(outputFile, JSON.stringify(info, null, 2));
        console.log('Data extracted and saved to', outputFile);
    } catch (error) {
        console.error('Error:', error);
    }
})();
