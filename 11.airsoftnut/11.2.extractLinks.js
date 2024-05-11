// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');

// async function extractLinks(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     const links = await page.evaluate(() => {
//         const h2s = Array.from(document.querySelectorAll('h2'));
//         let extractedLinks = [];

//         h2s.forEach(h2 => {
//             const nextUL = h2.nextElementSibling;
//             if (nextUL && nextUL.tagName === 'UL') {
//                 const lis = Array.from(nextUL.querySelectorAll('li > a'));
//                 lis.forEach(li => {
//                     extractedLinks.push({
//                         text: li.textContent,
//                         href: li.href
//                     });
//                 });
//             }
//         });

//         return extractedLinks;
//     });

//     await browser.close();
//     return links;
// }

// async function runExtractionFromUrls(filePath) {
//     try {
//         const fileContent = fs.readFileSync(filePath, 'utf8');
//         const urls = fileContent.split('\n').filter(Boolean);
//         let allData = [];

//         for (const url of urls) {
//             console.log(`Extracting data from ${url}`);
//             const data = await extractLinks(url);
//             allData.push({
//                 url: url,
//                 links: data
//             });
//         }

//         const outputFile = path.join(__dirname, 'extracted_links.json');
//         fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
//         console.log(`Data has been written to JSON file successfully: ${outputFile}`);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// const inputUrlsFile = path.join(__dirname, 'links.txt');
// runExtractionFromUrls(inputUrlsFile);



const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function extractLinks(url) {
    const browser = await puppeteer.launch();
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
}

async function runExtractionFromUrls(inputFile, outputFile) {
    try {
        const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
        let allLinks = [];

        for (const url of urls) {
            console.log(`Extracting data from ${url}`);
            const links = await extractLinks(url);
            allLinks = allLinks.concat(links);
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

