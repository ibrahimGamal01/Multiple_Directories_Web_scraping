## Web Scraper for Fun Center Directory

This script, `01.js`, is a web scraper that extracts data from the Fun Center Directory website. 

### What it Does
The script navigates to the Fun Center Directory pages and extracts the following information from each listing:

Website: `https://funcenterdirectory.com/directory/`

Ignore these parameters CITY, ZIP_CODE, STATE_PROVINCE as the data is no way organized to extract them separate 

- Company Name
- Logo URL
- Description
- Phone
- Address
- Address1
- City
- Zip Code
- State/Province
- Website URL
- Category

This data is then saved in three formats: JSON, CSV, and TXT. The JSON data is saved to `scrapedData.json`, the CSV data is saved to `scrapedData.csv`, and the TXT data is saved to `scrapedData.txt`.

### How to Use

1. Ensure you have Node.js installed on your machine.
2. Install the necessary dependencies by running `npm install puppeteer csv-writer`.
3. Run the script with `node 01.js`.

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
