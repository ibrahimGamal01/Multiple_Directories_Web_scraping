const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractBusinessLinks(urlListFile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const urls = fs.readFileSync(urlListFile, 'utf8').split('\n').filter(Boolean);
    const businessLinks = [];

    for (const url of urls) {
        try {
            console.log('Navigating to the URL:', url);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            const links = await page.evaluate(() => {
                const articleElements = document.querySelectorAll('article');
                const businessLinks = [];

                articleElements.forEach(article => {
                    const link = article.querySelector('a[href^="https://www.axethrowingguide.com/location/"]');
                    if (link) {
                        businessLinks.push(link.href);
                    }
                });

                return businessLinks;
            });

            businessLinks.push(...links);
            console.log('Business links extracted:', links);
        } catch (error) {
            console.error('Error extracting business links:', error);
        }
    }

    await browser.close();

    // Write the extracted business links to a file
    fs.writeFileSync('15.2.links.txt', businessLinks.join('\n'));
    console.log('Business links saved to 15.2.links.txt file.');
}

// Example usage
extractBusinessLinks('15.1.links.txt').catch(error => console.error('Error:', error));
