const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeDataFromLink(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const data = await page.evaluate(() => {
            const title = document.querySelector('.title-wrap .heading')?.innerText || null;
            const addressElement = document.querySelector('.info-description .text .label + span');
            const addressParts = Array.from(addressElement?.parentNode?.childNodes || [])
                .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
                .map(node => node.textContent.trim());
            const address = addressParts.join(', ');

            const contactInfo = {};
            const contactItems = Array.from(document.querySelectorAll('.info-description .data-list dt'));
            contactItems.forEach(item => {
                const key = item.innerText;
                const value = item.nextElementSibling.innerText;
                contactInfo[key] = value;
            });
            const website = contactInfo['Website'] || null;
            const facebook = contactInfo['Facebook'] || null;
            const twitter = contactInfo['Twitter'] || null;
            const instagram = contactInfo['Instagram'] || null;

            
            const contactName = contactInfo['Contact'] || null;
            const contactEmail = contactInfo['Email'] || null;

            return { title, address, website, contactName, contactEmail, facebook, twitter, instagram };
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error(`Error scraping ${url}: ${error}`);
        await browser.close();
        return null;
    }
}

async function scrapeAllLinks() {
    try {
        const links = fs.readFileSync('links.txt', 'utf8').split('\n').map(link => link.trim()).filter(Boolean);
        const scrapedData = [];

        for (let url of links) {
            console.log('Scraping data from link: ' + url);
            const data = await scrapeDataFromLink(url);
            scrapedData.push(data);
        }

        fs.writeFileSync('78.Data.json', JSON.stringify(scrapedData, null, 2));
        console.log('Scraped data saved to 78.Data.json');
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAllLinks();
