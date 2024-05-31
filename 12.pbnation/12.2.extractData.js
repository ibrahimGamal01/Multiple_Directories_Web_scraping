const fs = require('fs');
const puppeteer = require('puppeteer');

async function extractFieldInformation(url, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        try {
            console.log('Navigating to the URL:', url);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

            console.log('Extracting field information...');

            const data = await page.evaluate(() => {
                const trElements = Array.from(document.querySelectorAll('.tborder tr'));

                const fieldData = trElements.map(tr => {
                    const name = tr.querySelector('.alt1 div > div')?.textContent.trim();
                    const description = tr.querySelector('.alt1 div[style*="text-align: justify"]')?.textContent.trim();
                    const address = tr.querySelector('.alt1 + td .smallfont')?.textContent.trim();
                    const websiteElement = tr.querySelector('.alt1 div > a');
                    const website = websiteElement ? websiteElement.href : 'Website not found';
                    const email = tr.querySelector('.fieldicons.email a')?.href.split(':')[1];
                    const rating = tr.querySelector('.star-rating .current-rating')?.style.width; // Returns width which is proportional to the rating value

                    return { name, address, website, description, email, rating };
                });

                return fieldData.filter(data => data.name && data.address && data.website !== 'Website not found');
            });

            console.log('Extracted Field Information:', data);

            await browser.close();
            return data;
        } catch (error) {
            console.error('Error during extraction:', error);
            await browser.close();
            retries++;
            console.log(`Retrying (${retries}/${maxRetries})...`);
        }
    }

    console.error(`Max retries (${maxRetries}) reached for URL: ${url}. Skipping...`);
    return null;
}

async function processUrlsFromFile(filePath) {
    try {
        const urls = fs.readFileSync(filePath, 'utf8').split('\n').filter(url => url.trim() !== '');
        const extractedData = [];

        for (const url of urls) {
            const fieldData = await extractFieldInformation(url);
            if (fieldData !== null) {
                console.log('Extracted Information for', url, ':', fieldData);
                extractedData.push(...fieldData); // Push each data object directly into the array
            } else {
                console.log('Skipping URL:', url);
            }
        }

        // Write extracted data to a JSON file
        const outputFilePath = 'extracted_data.json';
        fs.writeFileSync(outputFilePath, JSON.stringify(extractedData, null, 2));
        console.log('Extracted data saved to:', outputFilePath);
    } catch (error) {
        console.error('Error processing URLs:', error);
    }
}

const filePath = '12.Links.txt'; // Update with your file path
processUrlsFromFile(filePath);

