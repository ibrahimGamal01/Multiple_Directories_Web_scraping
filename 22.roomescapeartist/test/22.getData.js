const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true }); // Launch browser in headless mode
    const page = await browser.newPage();

    try {
        // Go to the webpage
        await page.goto('https://roomescapeartist.com/find-a-room/', { waitUntil: 'networkidle2' });

        // Wait for the table to appear
        await page.waitForSelector('.v-data-table__wrapper');

        // Scrape the data
        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.v-data-table__wrapper tbody tr'));
            const roomData = rows.map(row => {
                const cells = row.querySelectorAll('td.text-left');
                return {
                    company: cells[0]?.innerText.trim() || '',
                    city: cells[1]?.innerText.trim() || '',
                    region: cells[2]?.innerText.trim() || '',
                    country: cells[3]?.innerText.trim() || '',
                    reviewed: cells[4]?.innerText.trim() || ''
                };
            });
            return roomData;
        });

        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
