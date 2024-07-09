const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const retryLimit = 3;
    let retryCount = 0;
    let data = [];

    while (retryCount < retryLimit) {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('https://airgunsdaddy.com/directory/fields/', { waitUntil: 'networkidle2' });

            data = await page.evaluate(() => {
                const extractData = (element, selector, attribute) => {
                    const el = element.querySelector(selector);
                    return el ? (attribute ? el.getAttribute(attribute) : el.textContent.trim()) : null;
                };

                const listings = document.querySelectorAll('.tcb-flex-row');
                const results = [];

                listings.forEach(listing => {
                    const name = extractData(listing, '.tve_image_caption img', 'alt');
                    if (!name) return; // Skip if name is null

                    const link = extractData(listing, '.thrv_wrapper.thrv_text_element h3 a', 'href');
                    const logoLink = extractData(listing, '.tve_image_frame a img', 'src');
                    const about = extractData(listing, '.thrv_wrapper.thrv_text_element.dynamic-group-k69h70u1 .tcb-plain-text');
                    
                    const addressElement = listing.querySelector('.tcb-plain-text');
                    const address = addressElement ? addressElement.textContent.trim() : 'N/A';
                    const addressLink = addressElement ? addressElement.querySelector('a')?.href || 'N/A' : 'N/A';

                    const phone = extractData(listing, '.phone-selector');
                    const mail = extractData(listing, '.mail-selector');
                    const website = extractData(listing, '.website-selector', 'href');

                    const features = [];
                    listing.querySelectorAll('.thrv-styled-list-item span').forEach(feature => {
                        features.push(feature.textContent.trim());
                    });

                    results.push({
                        name,
                        link,
                        logoLink,
                        about,
                        address,
                        // addressLink,
                        phone: phone || 'N/A',
                        // mail: mail || 'N/A',
                        website: website || 'N/A',
                        features,
                    });
                });

                return results;
            });

            await browser.close();
            break; // Exit the retry loop if successful
        } catch (error) {
            console.error(`Error during scraping: ${error}`);
            retryCount++;

            if (retryCount < retryLimit) {
                console.log(`Retrying... (${retryLimit - retryCount} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            } else {
                console.log('Max retries reached. Exiting.');
            }
        }
    }

    if (data.length > 0) {
        const outputFile = '06.links.json';
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log(`Data saved to ${outputFile}`);
    } else {
        console.log('No data scraped.');
    }
})();
