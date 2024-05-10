const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Function to handle retrying navigation
    const retryNavigation = async (url, retries = 3) => {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
        } catch (error) {
            if (retries > 0) {
                console.error('Navigation error. Retrying...', error);
                await retryNavigation(url, retries - 1);
            } else {
                throw new Error('Max retries exceeded for navigation.');
            }
        }
    };

    const initialUrl = 'https://funcenterdirectory.com/directory/?type=place&pg=2&sort=latest';
    await retryNavigation(initialUrl);

    const listings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.grid-item')).map(element => {
            const companyName = element.querySelector('h4.case27-primary-text.listing-preview-title')?.textContent.trim();
            const logoUrl = element.querySelector('.lf-avatar')?.style.backgroundImage.match(/url\("?(.+?)"?\)/)[1];
            const description = element.querySelector('h6')?.textContent.trim();
            const contactInfo = element.querySelectorAll('.lf-contact li');
            const phone = contactInfo[0]?.textContent.trim();
            const address = contactInfo[1]?.textContent.trim();
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

    console.log(listings);

    await browser.close();
})();