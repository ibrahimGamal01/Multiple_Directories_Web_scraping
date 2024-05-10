## Web Scraper for MyKidList

This script, `02.mykidlist.js`, is a web scraper that extracts data from the MyKidList website. 

### What it Does
The script navigates to the MyKidList page and extracts the following information:

Website: `https://mykidlist.com/arcades-game-play-laser-tag/`

The data extracted from this site is less structured as it is a blog. The data formatting can be enhanced using more scripting, which would consume a lot of time.

This data is then saved in a JSON format. The JSON data is saved to `extracted_data.json`.

### How to Use

1. Ensure you have Node.js installed on your machine.
2. Install the necessary dependencies by running `npm install puppeteer`.
3. Run the script with `node 02.mykidlist.js`.

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
