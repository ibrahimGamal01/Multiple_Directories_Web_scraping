const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const maxRetries = 3;
    const batchSize = 100; // Process 100 URLs at a time

    for (let startId = 1; startId <= 18000; startId += batchSize) {
        const endId = Math.min(startId + batchSize - 1, 18000);
        console.log(`Processing batch: ${startId} to ${endId}`);
        const batchData = [];

        for (let id = startId; id <= endId; id++) {
            const url = `https://www.museumsusa.org/museums/info/${id}`;
            console.log('Scraping:', url);

            let success = false;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

                    const museumData = await page.evaluate(() => {
                        const getTextContent = (selector) => document.querySelector(selector)?.textContent.trim() || null;
                        const getHref = (selector) => document.querySelector(selector)?.href.trim() || null;

                        const name = getTextContent('#ctl04_ctl00_orgName a');
                        const streetAddress = getTextContent('#ctl04_ctl00_icStreetAddress');
                        const mailingAddress = getTextContent('#ctl04_ctl00_icMailingAddress');
                        const phone = getTextContent('#ctl04_ctl00_icPhoneEmailWeb .phone');
                        const website = getHref('#ctl04_ctl00_icPhoneEmailWeb a');
                        const socialLinks = {
                            facebook: getHref('a[title="Facebook"]'),
                            twitter: getHref('a[title="Twitter"]'),
                            instagram: getHref('a[title="Instagram"]'),
                            linkedin: getHref('a[title="LinkedIn"]'),
                            youtube: getHref('a[title="YouTube"]'),
                        };
                        const hours = getTextContent('#ctl04_ctl00_ecHours .ui.grid .ui.row:nth-child(2)');
                        const museumTypes = Array.from(document.querySelectorAll('#ctl04_ctl00_dlCategories a')).map(el => el.textContent.trim());

                        return {
                            name,
                            address: {
                                streetAddress,
                                mailingAddress,
                            },
                            phone,
                            website,
                            socialLinks,
                            hours,
                            museumTypes,
                        };
                    });

                    if (museumData.name) {
                        batchData.push(museumData);
                    }
                    success = true;
                    break; // Break the retry loop on success
                } catch (error) {
                    console.error(`Error scraping ${url} (attempt ${attempt + 1}):`, error.message);
                    if (attempt === maxRetries - 1) {
                        console.error(`Failed to scrape ${url} after ${maxRetries} attempts.`);
                    }
                }
            }
        }

        const batchFileName = `museums_data_${startId}_to_${endId}.json`;
        fs.writeFileSync(batchFileName, JSON.stringify(batchData, null, 2), (err) => {
            if (err) {
                console.error(`Error writing file ${batchFileName}:`, err);
            } else {
                console.log(`Data successfully written to ${batchFileName}`);
            }
        });
    }

    await browser.close();
})();
