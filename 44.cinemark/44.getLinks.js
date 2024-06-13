const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeCinemarkLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to URL:', url);
        await page.goto(url);

        // Wait for the theatre list to load
        await page.waitForSelector('.columnList .theatres-by-state');

        console.log('Scraping links...');
        const links = await page.evaluate(() => {
            const linkElements = Array.from(document.querySelectorAll('.columnList .theatres-by-state ul li a'));
            return linkElements.map(link => ({
                href: link.href,
                text: link.innerText.trim()
            }));
        });

        return links;
    } catch (error) {
        console.error('Error during scraping:', error);
        return null;
    } finally {
        await browser.close();
    }
}

const url = 'https://www.cinemark.com/full-theatre-list';
const outputFile = 'cinemark_links.json';

scrapeCinemarkLinks(url)
    .then(links => {
        if (links && links.length > 0) {
            fs.writeFileSync(outputFile, JSON.stringify(links, null, 2));
            console.log(`Scraping completed. Links saved to ${outputFile}`);
        } else {
            console.log('No links scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
