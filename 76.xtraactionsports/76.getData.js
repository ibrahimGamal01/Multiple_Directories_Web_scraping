const fs = require('fs');
const puppeteer = require('puppeteer');

const maxRetries = 3;
const baseUrl = '';

async function scrapeGoKartTracks(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        let retryCount = 0;
        let data;

        while (retryCount < maxRetries) {
            try {
                await page.waitForSelector('.listing-box', { visible: true, timeout: 30000 });
                data = await page.evaluate(() => {
                    const tracks = document.querySelectorAll('.listing-box');
                    const results = [];

                    tracks.forEach(track => {
                        const getName = () => {
                            const nameElement = track.querySelector('h2');
                            return nameElement ? nameElement.innerText.trim() : '';
                        };

                        const getDescription = () => {
                            const descElement = track.querySelector('p');
                            return descElement ? descElement.innerText.trim() : '';
                        };

                        const getPhone = () => {
                            const phoneElement = track.querySelector('.phone');
                            return phoneElement ? phoneElement.innerText.trim() : '';
                        };

                        const getWebsite = () => {
                            const websiteElement = track.querySelector('.web a');
                            return websiteElement ? websiteElement.href : '';
                        };

                        const getAddress = () => {
                            const addressElement = track.querySelector('.address');
                            return addressElement ? addressElement.innerText.trim() : '';
                        };

                        results.push({
                            Name: getName(),
                            Description: getDescription(),
                            Phone: getPhone(),
                            Website: getWebsite(),
                            Address: getAddress()
                        });
                    });

                    return results;
                });

                break; 
            } catch (error) {
                retryCount++;
                console.error(`Retry ${retryCount}/${maxRetries}: Error waiting for selector in ${url}`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        return data || [];

    } catch (error) {
        console.error(`Error scraping go-kart tracks from ${url}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function scrapeAllLinksFromFile(filePath) {
    try {
        const links = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        const scrapedData = [];

        for (const link of links) {
            const data = await scrapeGoKartTracks(baseUrl + link);
            scrapedData.push(...data);
            console.log(`Successfully scraped data from ${baseUrl}${link}`);
        }

        fs.writeFileSync('76.Data.json', JSON.stringify(scrapedData, null, 2));
        console.log('Scraped data saved to 76.Data.json');
    } catch (error) {
        console.error('Error scraping links from file:', error);
    }
}

const linksFilePath = '76.links.txt';
scrapeAllLinksFromFile(linksFilePath);
