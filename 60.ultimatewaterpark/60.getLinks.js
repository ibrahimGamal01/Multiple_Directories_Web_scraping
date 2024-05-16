const puppeteer = require('puppeteer');

async function scrapeLinks() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.ultimatewaterpark.com/waterparks/parks_by_name.php');

    const links = await page.evaluate(() => {
        const linkElements = Array.from(document.querySelectorAll('.wpList li a'));
        return linkElements.map(link => link.href);
    });

    await browser.close();
    return links;
}

scrapeLinks()
    .then(links => {
        links.forEach(link => console.log(link));
    })
    .catch(error => console.error('Error scraping links:', error));
