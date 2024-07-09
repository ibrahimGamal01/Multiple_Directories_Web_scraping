const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function extractInformation(url, retryCount = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        console.log('Extracting information...');
        const result = await page.evaluate(() => {
            const extractText = (selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent.replace('Address:', '').trim() : null;
            };

            const extractHref = (selector) => {
                const element = document.querySelector(selector);
                const href = element ? element.href : null;
                if (href && href.startsWith('mailto:')) {
                    return href.substring(7);
                }
                return href;
            };

            const extractOpeningHours = () => {
                const hours = {};
                document.querySelectorAll('.hidding-timings li').forEach(li => {
                    const day = li.querySelector('.days').textContent.trim();
                    const time = li.querySelector('.hours').textContent.trim();
                    hours[day] = time;
                });
                return hours;
            };

            return {
                name: extractText('.single-item.txt_title .item-value'),
                logoUrl: document.querySelector('.elementor-widget-image img') ? document.querySelector('.elementor-widget-image img').src : null,
                openingHours: extractOpeningHours(),
                website: extractHref('.single-item._website .item-value a'),
                email: extractHref('.single-item._email .item-value a'),
                location: extractText('.single-item.listing_location .item-value span.more-tax-item'),
                address: extractText('.single-item._address .item-value'),
                phone: extractHref('.single-item._phone1 .item-value a'),
                keyword: extractText('.single-item.listing_keyword .item-value span.no-data') || extractText('.single-item.listing_keyword .item-value span.more-tax-item')
            };
        });

        console.log('Extracted Data:', result);

        await browser.close();
        return result;
    } catch (error) {
        console.error('Error during extraction:', error);

        if (retryCount > 0) {
            console.log(`Retrying ${retryCount} more times for URL: ${url}`);
            await page.close();
            await browser.close();
            return extractInformation(url, retryCount - 1);
        } else {
            console.log(`Failed to extract data after retries for URL: ${url}`);
            await browser.close();
            return null;
        }
    }
}

async function runExtraction() {
    const inputFile = path.join(__dirname, 'arrowtag_locations.txt');
    const outputFile = path.join(__dirname, '79.Data.json');
    const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);

    const concurrencyLimit = 5; // Adjust this number based on your system's capability
    let index = 0;

    async function runBatch() {
        const batch = urls.slice(index, index + concurrencyLimit);
        index += concurrencyLimit;

        const promises = batch.map(url => extractInformation(url));
        const results = await Promise.all(promises);

        results.forEach(result => {
            if (result) extractedData.push(result);
        });

        if (index < urls.length) {
            await runBatch();
        }
    }

    const extractedData = [];
    await runBatch();

    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    console.log(`Extraction completed. Data saved to ${outputFile}`);
}

runExtraction().catch(error => console.error('Error during extraction:', error));
