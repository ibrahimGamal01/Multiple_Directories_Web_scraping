const puppeteer = require('puppeteer');

async function scrapeIFlyWorldData(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 }); // Increased timeout to 120 seconds

        const data = await page.evaluate(() => {
            const locationInfo = document.querySelector('#location_info');

            const name = locationInfo.querySelector('.location-main-heading')?.innerText.trim() || null;

            const addressBlock = locationInfo.querySelector('.cre-18-address-mob');
            const address = addressBlock.querySelector('.cre-18-location-address')?.innerText.trim() || null;
            const addressLink = addressBlock.querySelector('.cre-18-get-direction-btn a')?.href || null;

            const contactInfo = locationInfo.querySelector('.cre-18-contact-info-mob');
            const mail = contactInfo.querySelector('.cre-mob-email-text a')?.innerText.trim() || null;
            const phone = contactInfo.querySelector('.cre-mob-phone-text a')?.innerText.trim() || null;

            return { name, address, addressLink, mail, phone };
        });

        return data;

    } catch (error) {
        console.error('Error:', error);
        return {};
    } finally {
        await browser.close();
    }
}

const url = 'https://www.iflyworld.com/atlanta/';
scrapeIFlyWorldData(url)
    .then(data => console.log(data))
    .catch(error => console.error('Error scraping data:', error));
