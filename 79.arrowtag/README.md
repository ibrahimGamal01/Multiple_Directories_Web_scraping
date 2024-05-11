# Web Scraper for ArrowTag Locations

## How it works

The script navigates to the ArrowTag locations page and clicks the "Load More" button 33 times to load all locations. After each click, it waits for 5 seconds to allow the page to load the new content. Once all locations are loaded, it scrapes the links to each location and saves them to a text file.

Website: https://arrowtag.com/locations/

## Usage

1. Install the required dependencies:

```bash
npm install puppeteer fs
```

2. Run the script:

```bash
node 79.arrowtag.js
```

The script will save the scraped links to a file named `arrowtag_locations.txt`.

280 items will be saved

## Functions

- `scrapeArrowTagLocations(url)`: This is the main function that performs the web scraping. It takes a URL as input, navigates to the page, clicks the "Load More" button to load all locations, scrapes the links, and returns them.

- `delay(ms)`: This is a helper function that pauses the execution of the script for a specified amount of time. It takes the delay time in milliseconds as input.

## Error Handling

If an error occurs during the scraping process, the script will log the error message to the console and close the browser. If no links are scraped, it will log a message to the console indicating this.
