const puppeteer = require('puppeteer');

async function scrapeDirectoryPage(page, url) {
    await page.goto(url, { waitUntil: 'networkidle2' });

    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.grid-item')).map(element => {
            const companyName = element.querySelector('h4.case27-primary-text.listing-preview-title')?.textContent.trim();
            const logoUrl = element.querySelector('.lf-avatar')?.style.backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            const description = element.querySelector('h6')?.textContent.trim();
            const contactInfo = element.querySelectorAll('.lf-contact li');
            const phone = contactInfo[0]?.textContent.trim();
            const address = contactInfo[1]?.textContent.trim();
            const websiteUrl = element.querySelector('a')?.href;
            const category = element.querySelector('.category-name')?.textContent.trim();

            // Address breakdown
            let address1, city, stateProvince, zipCode;
            if (address) {
                const parts = address.split(',');
                address1 = parts[0]?.trim();
                city = parts[1]?.trim();
                stateProvince = parts.length > 2 ? parts[2].split(' ')[1]?.trim() : '';
                zipCode = parts.length > 2 ? parts[2].split(' ')[2]?.trim() : '';
            }

            return {
                companyName,
                logoUrl,
                description,
                phone,
                address,
                address1,
                city,
                zipCode,
                stateProvince,
                websiteUrl,
                category
            };
        });
    });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const listings = [];

    for (let i = 1; i <= 25; i++) {
        const url = `https://funcenterdirectory.com/directory/?type=place&pg=${i}&sort=latest`;
        console.log(`Scraping: ${url}`);
        try {
            const pageListings = await scrapeDirectoryPage(page, url);
            listings.push(...pageListings);
        } catch (error) {
            console.error(`Failed to scrape ${url}:`, error);
        }
    }

    console.log(listings);
    await browser.close();
})();
