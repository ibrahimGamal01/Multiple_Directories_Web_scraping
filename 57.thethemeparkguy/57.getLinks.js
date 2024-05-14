const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    await page.goto('https://www.thethemeparkguy.com/themepark/list.html');
    
    // Wait for the container with class "tp_container" to load
    await page.waitForSelector('.tp_container', { timeout: 60000 }); // Increase timeout to 60 seconds

    // Extract all links from the container
    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('.tp_container .tp_list a.title');
        const links = Array.from(linkElements).map(link => link.href);
        return links;
    });

    // Write the links to a text file
    fs.writeFileSync('links.txt', links.join('\n'));
    
    console.log('Links extracted and saved to links.txt');

    await browser.close();
})();
