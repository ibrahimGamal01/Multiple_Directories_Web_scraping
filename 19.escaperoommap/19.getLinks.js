const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractRoomLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a.card')).map(a => a.href);
        });

        console.log('Extracted Links:', links);
        return links;
    } catch (error) {
        console.error('Error during extraction:', error);
        return [];
    } finally {
        await browser.close();
    }
}

async function runExtraction() {
    const url = 'https://escaperoommap.lv/';
    const links = await extractRoomLinks(url);

    const outputFile = '19.links.txt';
    fs.writeFileSync(outputFile, links.join('\n'), 'utf8');
    console.log(`Extraction completed. Links saved to ${outputFile}`);
}

// Example usage
runExtraction().catch(error => console.error('Error:', error));
