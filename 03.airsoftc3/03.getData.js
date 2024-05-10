const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeUnitInfo(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const name = document.querySelector('#h1_wrap h1')?.textContent.trim();
            const website = document.querySelector('#unit_website')?.href;
            const contactInfos = Array.from(document.querySelectorAll('.contact_info'));

            let address = '';
            let addressUrl = '';
            let email = '';
            let phone = '';
            let website2 = '';

            contactInfos.forEach(contactInfo => {
                const label = contactInfo.querySelector('.contact_label')?.textContent.trim();
                const value = contactInfo.querySelector('.contact_value')?.textContent.trim();
                const anchor = contactInfo.querySelector('.contact_value a');

                if (label === 'Address') {
                    address = value;
                    addressUrl = anchor?.href;
                } else if (label === 'Email') {
                    email = value;
                } else if (label === 'Phone') {
                    phone = value;
                } else if (label === 'Website') {
                    website2 = value;
                }
            });

            const hoursOfOperation = Array.from(document.querySelectorAll('#hours_of_operation .hoursofop')).map(item => {
                const day = item.querySelector('.hoursofop_day')?.textContent.trim();
                const time = item.querySelector('.hoursofof_time')?.textContent.trim();
                return { day, time };
            });

            return {
                name,
                website,
                address,
                addressUrl,
                email,
                phone,
                website2,
                hoursOfOperation
            };
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return null;
    }
}

async function scrapeLinksFromFile(filePath) {
    try {
        const linksData = await fs.readFile(filePath, 'utf-8');
        const linksByState = JSON.parse(linksData);

        for (const state in linksByState) {
            const links = linksByState[state];
            console.log(`Scraping links for ${state}`);
            for (const link of links) {
                let retries = 3;
                let data = null;

                while (retries > 0) {
                    try {
                        data = await scrapeUnitInfo(link);
                        if (data) {
                            console.log('Data:', data);
                            break;
                        } else {
                            console.log('Failed to scrape:', link);
                            retries--;
                        }
                    } catch (error) {
                        console.error('Error during scraping:', error);
                        retries--;
                    }
                }

                if (retries === 0) {
                    console.log('Max retries reached for:', link);
                }
            }
        }
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

const filePath = 'linksByState.json';
scrapeLinksFromFile(filePath);