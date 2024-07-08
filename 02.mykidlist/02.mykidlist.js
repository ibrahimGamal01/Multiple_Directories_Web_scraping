const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeArcadesAndLaserTag(url, retries = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const items = [];
            const headings = document.querySelectorAll('h3.wp-block-heading');
            
            headings.forEach(heading => {
                const item = {};
                item.name = heading.querySelector('a')?.textContent.trim();
                item.link = heading.querySelector('a')?.href;
                
                const paragraphs = [];
                let nextElement = heading.nextElementSibling;
                
                while (nextElement && nextElement.tagName !== 'H3') {
                    if (nextElement.tagName === 'P') {
                        paragraphs.push(nextElement.textContent.trim());
                    }
                    nextElement = nextElement.nextElementSibling;
                }
                
                item.details = paragraphs.join('\n');
                items.push(item);
            });

            return items;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();

        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            return scrapeArcadesAndLaserTag(url, retries - 1);
        } else {
            console.log('Max retries reached. Skipping this URL.');
            return null;
        }
    }
}

const url = 'https://mykidlist.com/arcades-game-play-laser-tag/';
const outputFileJSON = '02.Data.json';

scrapeArcadesAndLaserTag(url)
    .then(data => {
        if (data) {
            fs.writeFileSync(outputFileJSON, JSON.stringify(data, null, 2));
            console.log(`Data saved to ${outputFileJSON}`);
        } else {
            console.log('No data scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
