const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function extractBusinessDetails(url, retryCount = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const result = await page.evaluate(() => {
            const addressElement = document.querySelector('.job_listing-location a');
            const address = addressElement?.innerText || null;
            const addressLink = addressElement?.href || null;
            const phoneElement = document.querySelector('.job_listing-phone a');
            const phone = phoneElement?.innerText || null;
            const emailElement = document.querySelector('.listing-email a');
            const email = emailElement?.innerText || null;
            const websiteElement = document.querySelector('.job_listing-url a');
            const website = websiteElement?.innerText || null;

            const openHoursElements = document.querySelectorAll('.widget-job_listing .business-hour');
            const openHours = Array.from(openHoursElements).reduce((hours, element) => {
                const day = element.querySelector('.day')?.innerText.trim();
                const time = element.querySelector('.business-hour-time')?.innerText.trim();
                if (day && time) {
                    hours[day] = time;
                }
                return hours;
            }, {});

            return { address, addressLink, phone, email, website, openHours };
        });

        // Derive name from URL
        const name = path.basename(url).replace(/-/g, ' ');

        console.log('Extracted Data:', { name, ...result });
        return { name, ...result };
    } catch (error) {
        console.error('Error during extraction:', error);

        if (retryCount > 0) {
            console.log(`Retrying ${retryCount} more times for URL: ${url}`);
            await page.close();
            await browser.close();
            return extractBusinessDetails(url, retryCount - 1);
        } else {
            console.log(`Failed to extract data after retries for URL: ${url}`);
            await browser.close();
            return null;
        }
    } finally {
        await browser.close();
    }
}

async function runExtractionFromFile(inputFile, outputFile) {
    const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
    const extractedData = [];

    for (const url of urls) {
        const data = await extractBusinessDetails(url);
        if (data) {
            extractedData.push(data);
        } else {
            console.log(`Failed to extract data for URL: ${url}`);
        }
    }

    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    console.log(`Extraction completed. Data saved to ${outputFile}`);
}

// Example usage
runExtractionFromFile('18.2.links.txt', '18.3.extractedData.json').catch(error => console.error('Error:', error));
