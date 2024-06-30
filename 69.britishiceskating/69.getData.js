const fs = require('fs');
const puppeteer = require('puppeteer');

const maxRetries = 3;
const baseUrl = 'https://britishiceskating.sport80.com/public/widget/';

async function scrapeRinkData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.waitForSelector('.v-expansion-panel', { visible: true });

        const data = await page.evaluate(async () => {
            const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

            const widgets = document.querySelectorAll('.v-expansion-panel');
            const results = [];

            for (const widget of widgets) {
                const header = widget.querySelector('.v-expansion-panel-header');
                if (!header) continue;

                // Click to expand the panel
                header.click();
                await delay(1000); // Wait for the content to be visible

                const getText = (selector, context = widget) => {
                    const element = context.querySelector(selector);
                    return element ? element.innerText.trim() : '';
                };

                const extractUrl = (text) => {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const match = text.match(urlRegex);
                    return match ? match[0] : '';
                };

                const name = getText('.v-expansion-panel-header strong');
                let address = '';
                let phone = '';
                let email = '';
                let website1 = '';
                let website2 = '';
                let website3 = '';

                const listItems = widget.querySelectorAll('.v-list-item');
                listItems.forEach(item => {
                    const icon = item.querySelector('.v-icon');
                    if (icon) {
                        if (icon.classList.contains('mdi-map-marker')) {
                            address = getText('.v-list-item__title', item);
                        } else if (icon.classList.contains('mdi-phone')) {
                            phone = getText('.v-list-item__title', item);
                        } else if (icon.classList.contains('mdi-email')) {
                            email = getText('.v-list-item__title', item);
                        }
                    }
                });

                const contentWrap = widget.querySelector('.v-expansion-panel-content__wrap');
                if (contentWrap) {
                    // Method 1: Extract from <a> tags
                    const linkElement = contentWrap.querySelector('a[href^="http"]');
                    if (linkElement) {
                        website1 = linkElement.href;
                    }

                    // Method 2: Extract from text content
                    website2 = extractUrl(contentWrap.innerText);

                    // Method 3: Extract from a specific field (example: 'Rink Website' label)
                    const rinkWebsiteLabel = Array.from(contentWrap.querySelectorAll('label')).find(label => label.innerText.includes('Rink Website'));
                    if (rinkWebsiteLabel) {
                        const rinkWebsiteSpan = rinkWebsiteLabel.closest('.row').querySelector('span');
                        if (rinkWebsiteSpan) {
                            website3 = extractUrl(rinkWebsiteSpan.innerText) || rinkWebsiteSpan.innerText.trim();
                        }
                    }
                }

                results.push({
                    Name: name,
                    Address: address !== '-' ? address : '',
                    Phone: phone !== '-' ? phone : '',
                    Email: email !== '-' ? email : '',
                    Website1: website1 !== '' ? website1 : 'N/A',
                    Website2: website2 !== '' ? website2 : 'N/A',
                    Website3: website3 !== '' ? website3 : 'N/A'
                });

                // Click to collapse the panel
                header.click();
                await delay(1000); // Wait for the content to collapse
            }

            return results;
        });

        return data;

    } catch (error) {
        console.error(`Error scraping rink data from ${url}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function scrapeAllLinks() {
    const scrapedData = [];

    for (let i = 1; i <= 8; i++) { 
        const url = `${baseUrl}${i}`;
        let success = false;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const data = await scrapeRinkData(url);
                scrapedData.push(...data);
                success = true;
                console.log(`Successfully scraped data from ${url}`);
                break;
            } catch (error) {
                console.error(`Attempt ${attempt} failed for ${url}`);
                if (attempt === maxRetries) {
                    console.error(`Failed to scrape data from ${url} after ${maxRetries} attempts, skipping...`);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        if (!success) {
            scrapedData.push({ url, error: `Failed to retrieve data after ${maxRetries} attempts` });
        }
    }

    fs.writeFileSync('69.Data.json', JSON.stringify(scrapedData, null, 2));
    console.log('Scraped data saved to 69.Data.json');
}

scrapeAllLinks().catch(error => console.error('Error scraping links:', error));
