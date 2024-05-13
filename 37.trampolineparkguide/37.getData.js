// const puppeteer = require('puppeteer');

// async function scrapeTrampolineParks(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url);

//     const data = await page.evaluate(() => {
//         const results = [];
//         const listings = document.querySelectorAll('.listing-box');

//         listings.forEach(listing => {
//             const cityName = listing.querySelector('.cityName')?.innerText;
//             const name = listing.querySelector('h2')?.innerText;
//             const details = Array.from(listing.querySelectorAll('ul li')).map(li => li.innerText);
//             const phone = listing.querySelector('.phone')?.innerText;
//             const email = listing.querySelector('.email')?.innerText;
//             const website = listing.querySelector('.address a')?.href;
//             const address = listing.querySelector('.addinfo')?.innerText;

//             results.push({
//                 city_name: cityName,
//                 name: name,
//                 details: details,
//                 phone: phone,
//                 email: email,
//                 website: website,
//                 address: address
//             });
//         });

//         return results;
//     });

//     await browser.close();
//     return data;
// }

// const url = 'http://www.trampolineparkguide.com/trampoline-parks-alabama.html';

// scrapeTrampolineParks(url).then(data => {
//     console.log(data);
// }).catch(error => {
//     console.error('Error:', error);
// });

// ! Full version

const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeTrampolineParks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const data = await page.evaluate(() => {
        const results = [];
        const listings = document.querySelectorAll('.listing-box');

        listings.forEach(listing => {
            const cityName = listing.querySelector('.cityName')?.innerText;
            const name = listing.querySelector('h2')?.innerText;
            const details = Array.from(listing.querySelectorAll('ul li')).map(li => li.innerText);
            const phone = listing.querySelector('.phone')?.innerText;
            const email = listing.querySelector('.email')?.innerText;
            const website = listing.querySelector('.address a')?.href;
            const address = listing.querySelector('.addinfo')?.innerText;

            results.push({
                city_name: cityName,
                name: name,
                details: details,
                phone: phone,
                email: email,
                website: website,
                address: address
            });
        });

        return results;
    });

    await browser.close();
    return data;
}

async function scrapeMultipleParks(file) {
    const content = fs.readFileSync(file, 'utf8');
    const urls = content.split('\n').map(line => line.trim()).filter(line => line);
    let allData = [];

    for (const url of urls) {
        if (url) {
            console.log(`Scraping: ${url}`);
            const data = await scrapeTrampolineParks(url);
            allData = allData.concat(data);
        }
    }

    return allData;
}

const file = 'links.txt';
scrapeMultipleParks(file).then(allData => {
    fs.writeFileSync('37.data.json', JSON.stringify(allData, null, 2));
    console.log('Scraping completed. Data saved to 37.data.json');
}).catch(error => {
    console.error('Error:', error);
});
