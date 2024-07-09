const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function extractLinks(url, retryLimit = 3) {
    let browser;
    let attempt = 0;

    while (attempt < retryLimit) {
        try {
            browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            const links = await page.evaluate(() => {
                const h2s = Array.from(document.querySelectorAll('h2'));
                let extractedLinks = [];
                h2s.forEach(h2 => {
                    const nextUL = h2.nextElementSibling;
                    if (nextUL && nextUL.tagName === 'UL') {
                        const lis = Array.from(nextUL.querySelectorAll('li > a'));
                        lis.forEach(li => {
                            extractedLinks.push(li.href);  // Only push the href attribute
                        });
                    }
                });
                return extractedLinks;
            });

            await browser.close();
            return links;
        } catch (error) {
            if (browser) {
                await browser.close();
            }
            console.error(`Attempt ${attempt + 1} failed for ${url}:`, error);
            attempt++;
        }
    }

    throw new Error(`Failed to extract links from ${url} after ${retryLimit} attempts`);
}

async function runExtractionFromUrls(inputFile, outputFile) {
    try {
        const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
        let allLinks = [];

        for (const url of urls) {
            console.log(`Extracting data from ${url}`);
            try {
                const links = await extractLinks(url);
                allLinks = allLinks.concat(links);
            } catch (error) {
                console.error(`Failed to extract links from ${url}:`, error);
            }
        }

        fs.writeFileSync(outputFile, allLinks.join('\n'));
        console.log(`Data has been written to ${outputFile} successfully.`);
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputUrlsFile = 'links.txt';
const outputLinksFile = '2_place_links.txt';
runExtractionFromUrls(inputUrlsFile, outputLinksFile);
