# Web Scraping with Puppeteer

This project demonstrates how to use Puppeteer for web scraping. Puppeteer is a Node.js library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.

## Files

### 11.2.extractLinks.js

This script extracts links from a list of URLs. The URLs are read from a text file (`links.txt`), one URL per line. The script launches a Puppeteer browser, navigates to each URL, and extracts the `href` attribute of all `a` elements under `ul` elements that are siblings of `h2` elements. The extracted links are written to another text file (`2_place_links.txt`).

### 11.3.extractData.js

This script extracts business details from a list of URLs. The URLs are read from a text file (`2_place_links.txt`), one URL per line. The script launches a Puppeteer browser, navigates to each URL, and extracts the following details:

- Name: Text content of the element with class `FieldName`
- Address: Text content of the `p` element under the element with class `AirsoftBusinessListing`
- Phone: `href` attribute of the `a` element with `href` starting with `tel:` under the element with class `AirsoftBusinessListing`
- Website: `href` attribute of the `a` element with `href` starting with `http:` under the element with class `AirsoftBusinessListing`
- Facebook: `href` attribute of the `a` element with `href` containing `facebook` under the element with class `AirsoftBusinessListing`

The extracted details are written to a JSON file (`extracted_data.json`).

## How to use

1. Install the dependencies:

```bash
npm install
```

2. Run the link extraction script:

```bash
node 11.2.extractLinks.js
```

3. Run the data extraction script:

```bash
node 11.3.extractData.js
```
