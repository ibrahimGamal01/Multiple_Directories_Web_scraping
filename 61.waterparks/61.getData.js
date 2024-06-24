const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeWebsite() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Open the webpage
    await page.goto('https://www.waterparks.org/web/Find_A_Park.aspx');

    // Interact with the page
    await page.type('input[name*="TextBox1"]', '" "');
    await page.click('input[name*="SubmitButton"]');

    // Wait for the data to load (adjust wait time as needed)
    // await page.waitForTimeout(10000);

    // Get the HTML content of the page after interaction
    await page.waitForTimeout(10000);

    // Load the HTML content into Cheerio for scraping
    const $ = cheerio.load(pageContent);

    // Scrape the desired data (replace with your scraping logic)
    const scrapedData = [];
    $('table#ctl01_TemplateBody_WebPartManager1_gwpciNewQueryMenuCommon_ciNewQueryMenuCommon_ResultsGrid_Grid1 tr').each((index, element) => {
        const rowData = [];
        $(element).find('td').each((i, cell) => {
            rowData.push($(cell).text().trim());
        });
        if (rowData.length > 0) {
            scrapedData.push(rowData);
        }
    });

    // Save or process the scraped data (example: write to a JSON file)
    fs.writeFileSync('scraped_data.json', JSON.stringify(scrapedData, null, 2));

    await browser.close();
}

scrapeWebsite();
