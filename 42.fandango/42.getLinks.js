const puppeteer = require('puppeteer');
const fs = require('fs');

async function fetchTheaterLinks(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the relevant content to load
    await page.waitForSelector('body');

    // Extract the links using class selectors
    const links = await page.$$eval('body a', anchors => 
        anchors.map(anchor => anchor.href)
    );

    await browser.close();
    return links;
}

async function main() {
    const linksFile = '42.links.txt';
    const urls = fs.readFileSync(linksFile, 'utf-8').trim().split('\n').map(url => url.trim());

    let allTheaterLinks = [];

    for (const url of urls) {
        console.log(`Fetching data from ${url}...`);
        const theaterLinks = await fetchTheaterLinks(url);
        allTheaterLinks = allTheaterLinks.concat(theaterLinks);
    }

    const outputFilePath = '42.locations.txt';
    const outputData = allTheaterLinks.join('\n');
    fs.writeFileSync(outputFilePath, outputData);
    console.log(`Theater links have been written to ${outputFilePath}`);
}

main();
