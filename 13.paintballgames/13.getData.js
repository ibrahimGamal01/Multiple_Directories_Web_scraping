// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function scrapePaintballCentres(url, retryCount = 3) {
//     let centreData = {};

//     for (let i = 0; i < retryCount; i++) {
//         try {
//             const browser = await puppeteer.launch();
//             const page = await browser.newPage();
//             await page.goto(url);

//             centreData = await page.evaluate(() => {
//                 const centreBanner = document.querySelector('.centre-banner');
//                 const centreName = centreBanner.querySelector('.subpage-text h1').textContent.trim();
//                 const bookingLink = centreBanner.querySelector('.btn.book-now-btn').href;

//                 const notes = document.querySelectorAll('.subpage-notes .note-wrap');
//                 const minimumAgeNote = notes[0].querySelector('.subpage-note-txt span').textContent.trim();
//                 const directionsLink = notes[1].querySelector('.directions').href;
//                 const address = notes[2].querySelector('.subpage-note-txt span').textContent.trim();

//                 return { centreName, bookingLink, minimumAgeNote, directionsLink, address };
//             });

//             await browser.close();
//             break; // If successful, break out of the retry loop
//         } catch (error) {
//             console.error(`Error scraping ${url}:`, error);
//             if (i === retryCount - 1) {
//                 console.error(`Failed to scrape ${url} after ${retryCount} attempts.`);
//             }
//         }
//     }

//     return centreData;
// }

// async function scrapeAllLinks(file) {
//     try {
//         const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
//         let allCentreData = [];

//         for (const url of urls) {
//             console.log(`Scraping data from ${url}`);
//             const data = await scrapePaintballCentres(url);
//             allCentreData.push(data);
//         }

//         fs.writeFileSync('paintball_centres_data.json', JSON.stringify(allCentreData, null, 2));
//         console.log('Data saved to paintball_centres_data.json');
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// const inputFile = '13.links.txt';
// scrapeAllLinks(inputFile);


const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapePaintballCentres(url, retryCount = 3) {
    let centreData = {};

    for (let i = 0; i < retryCount; i++) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);

            centreData = await page.evaluate(() => {
                const centreBanner = document.querySelector('.centre-banner');
                const centreNameElement = centreBanner.querySelector('.subpage-text h1');
                const bookingLinkElement = centreBanner.querySelector('.btn.book-now-btn');

                const centreName = centreNameElement ? centreNameElement.textContent.trim() : '';
                const bookingLink = bookingLinkElement ? bookingLinkElement.href : '';

                const notes = document.querySelectorAll('.subpage-notes .note-wrap');
                const minimumAgeNote = notes[0] ? notes[0].querySelector('.subpage-note-txt span').textContent.trim() : '';
                const directionsLink = notes[1] ? notes[1].querySelector('.directions').href : '';
                const address = notes[2] ? notes[2].querySelector('.subpage-note-txt span').textContent.trim() : '';

                return { centreName, bookingLink, minimumAgeNote, directionsLink, address };
            });

            await browser.close();
            break; // If successful, break out of the retry loop
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            if (i === retryCount - 1) {
                console.error(`Failed to scrape ${url} after ${retryCount} attempts.`);
            }
        }
    }

    return centreData;
}

async function scrapeAllLinks(file) {
    try {
        const urls = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
        let allCentreData = [];

        for (const url of urls) {
            console.log(`Scraping data from ${url}`);
            const data = await scrapePaintballCentres(url);
            allCentreData.push(data);
        }

        fs.writeFileSync('paintball_centres_data.json', JSON.stringify(allCentreData, null, 2));
        console.log('Data saved to paintball_centres_data.json');
    } catch (error) {
        console.error('Error:', error);
    }
}

const inputFile = '13.links.txt';
scrapeAllLinks(inputFile);
