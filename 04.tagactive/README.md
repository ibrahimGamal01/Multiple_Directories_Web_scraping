## Web Scraper for TagActive Arena

This script, `04.tagactive.js`, is a web scraper that extracts data from the TagActive Arena website. 

### What it Does
The script navigates to the TagActive Arena product page and extracts the following information from each product card:
Website: `https://www.tagactive.co.uk/products/tagactivearena.html`

- Title
- Website URL
- Address
- Visit Website URL

This data is then saved in two formats: JSON and CSV. The JSON data is saved to `scrapedData.json` and the CSV data is saved to `scrapedData.csv`.

### How to Use

1. Ensure you have Node.js installed on your machine.
2. Install the necessary dependencies by running `npm install puppeteer jsonfile csv-writer`.
3. Run the script with `node 04.tagactive.js`.

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
