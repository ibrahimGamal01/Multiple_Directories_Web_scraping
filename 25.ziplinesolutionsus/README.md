# Web Scraper for Zipline Locations

This script is a web scraper that extracts data from the Zipline Solutions locations page. It uses Puppeteer, a Node.js library that provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## How it works

The script navigates to the Zipline Solutions locations page and extracts the following information from each location card:

- Image URL
- Name
- Website
- Address
- Phone number
- Two descriptions

The extracted data is then saved to a JSON file named `locations.json`.

## Usage

1. Install the required dependencies:

```bash
npm install puppeteer fs
```

2. Run the script:

```bash
node 25.zipline.js
```

The script will save the scraped data to a file named `locations.json`.

## Functions

- `extractLocations(url)`: This is the main function that performs the web scraping. It takes a URL as input, navigates to the page, extracts the data from each location card, and returns the data.

## Error Handling

If an error occurs during the scraping process or while writing the data to the JSON file, the script will log the error message to the console.
