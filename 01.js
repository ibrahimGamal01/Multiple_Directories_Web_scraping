const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://funcenterdirectory.com/directory/', { waitUntil: 'networkidle2' });

    // Selecting all the listings on the page
    const listings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.grid-item')).map(element => {
            const companyName = element.querySelector('h4.case27-primary-text.listing-preview-title')?.textContent.trim();
            const logoUrl = element.querySelector('.lf-avatar')?.style.backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            const phone = element.querySelector('.icon-phone-outgoing + span')?.textContent.trim();
            const address = element.querySelector('.icon-location-pin-add-2 + span')?.textContent.trim();
            const websiteUrl = element.querySelector('a')?.href;
            const category = element.querySelector('.category-name')?.textContent.trim();

            // Address breakdown (simplified parsing, assuming US-style addresses)
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

    console.log(listings);

    await browser.close();
})();


