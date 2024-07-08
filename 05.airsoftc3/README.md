## Web Scraper for Airsoft Fields

This script, `05.airsoft.js`, is a web scraper that extracts data from the AirsoftC3 website. 

### What it Does
The script is divided into two parts:

1. `05.getLinks.js`: This script navigates to the AirsoftC3 pages for each state in the United States and extracts the links to each individual field's page.

2. `05.getData.js`: This script goes through the links extracted by `05.getLinks.js` and extracts the following information from each field's page:

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
3. Run `node index.js` and the code will run both codes fine (it will take lots of time).

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
