## Web Scraper for Airsoft Fields

This script, `03.airsoft.js`, is a web scraper that extracts data from the AirsoftC3 website. 

### What it Does
The script is divided into two parts:

1. `03.extractLinks.js`: This script navigates to the AirsoftC3 pages for each state in the United States and extracts the links to each individual field's page.

2. `03.getData.js`: This script goes through the links extracted by `03.extractLinks.js` and extracts the following information from each field's page:

- Name
- Website
- Address
- Address URL
- Email
- Phone
- Secondary Website
- Hours of Operation

This data is then saved in a JSON format. The JSON data is saved to `scrapedData.json`.

### How to Use

1. Ensure you have Node.js installed on your machine.
2. Install the necessary dependencies by running `npm install puppeteer`.
3. Run `03.extractLinks.js` with `node 03.extractLinks.js`. This will generate a file `linksByState.json` containing the links to each field's page.
4. Run `03.getData.js` with `node 03.getData.js`. This will go through the links in `linksByState.json` and extract the data from each link, saving the data to `scrapedData.json`.

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
