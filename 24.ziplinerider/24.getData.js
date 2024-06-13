// const puppeteer = require('puppeteer');
// const fs = require('fs');

// async function scrapeZiplineData(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log(`Navigating to URL: ${url}`);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//         const data = await page.evaluate(() => {
//             const content = document.querySelector('#content');
//             if (!content) return null;

//             const locations = Array.from(content.querySelectorAll('.city')).map(city => {
//                 const name = city.innerText.trim();
//                 const info = city.nextElementSibling.innerText.trim();
//                 const phone = info.match(/\(\d{3}\) \d{3}-\d{4}/)?.[0] || null;
//                 const website = info.match(/http[s]?:\/\/[^\s]+/)?.[0] || null;
//                 const description = info.split('\n')[1].trim();

//                 return { name, address: info.split('\n')[0].trim(), phone, website, description };
//             });

//             return locations;
//         });

//         console.log('Scraped Data:', data);
//         return data;
//     } catch (error) {
//         console.error(`Error scraping URL ${url}:`, error);
//         return null;
//     } finally {
//         await browser.close();
//     }
// }

// async function runScraping() {
//     const linksFile = '24.links.txt';
//     const outputFile = 'ziplineData.json';

//     const links = fs.readFileSync(linksFile, 'utf8').split('\n').filter(link => link);

//     const results = [];

//     for (const link of links) {
//         const data = await scrapeZiplineData(link);
//         if (data) results.push(...data);
//     }

//     fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
//     console.log(`Scraping completed. Data saved to ${outputFile}`);
// }

// // Example usage
// runScraping().catch(error => console.error('Error:', error));


const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeZiplineData(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const data = await page.evaluate(() => {
            const content = document.querySelector('#content');
            if (!content) return null;

            const locations = Array.from(content.querySelectorAll('.city')).map(city => {
                const name = city.innerText.trim();
                const info = city.nextElementSibling.innerText.trim();
                const phone = info.match(/\(\d{3}\) \d{3}-\d{4}/)?.[0] || null;
                const websiteElement = city.nextElementSibling.querySelector('a[rel="nofollow"]');
                const website = websiteElement ? websiteElement.href : null;
                const description = info.split('\n')[1].trim();

                return { name, address: info.split('\n')[0].trim(), phone, website, description };
            });

            return locations;
        });

        console.log('Scraped Data:', data);
        return data;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

async function runScraping() {
    const linksFile = '24.links.txt';
    const outputFile = 'ziplineData.json';

    const links = fs.readFileSync(linksFile, 'utf8').split('\n').filter(link => link);

    const results = [];

    for (const link of links) {
        const data = await scrapeZiplineData(link);
        if (data) results.push(...data);
    }

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Scraping completed. Data saved to ${outputFile}`);
}

// Example usage
runScraping().catch(error => console.error('Error:', error));
