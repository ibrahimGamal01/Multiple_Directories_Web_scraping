# Web Scraping with Puppeteer

Website : https://www.pbnation.com
## File

### 12.2.extractData.js

This script extracts field information from a list of URLs. The URLs are read from a text file (`12.1.linkList.txt`), one URL per line. The script launches a Puppeteer browser, navigates to each URL, and extracts the following details:

- Name: Text content of the `div` element inside the `div` element under the `td` element with class `alt1`
- Description: Text content of the `div` element with `style` attribute containing `text-align: justify` under the `td` element with class `alt1`
- Address: Text content of the `div` element with class `smallfont` under the `td` element next to the `td` element with class `alt1`
- Website: `href` attribute of the `a` element under the `div` element inside the `div` element under the `td` element with class `alt1`
- Email: `href` attribute of the `a` element under the `div` element with class `fieldicons email`, split by `:` and take the second part
- Rating: `width` style of the `div` element with class `current-rating` under the `div` element with class `star-rating`

The extracted details are written to a JSON file (`extracted_data.json`).

## Usage

1. Install the dependencies:

```bash
npm install
```

2. Run the data extraction script:

```bash
node 12.2.extractData.js
```

## Note

The script uses Puppeteer's `page.evaluate()` method to run JavaScript code in the context of the page. The code inside `page.evaluate()` cannot access variables in the Node.js environment. Only serializable data (i.e., data that can be converted to JSON) can be passed in and out of `page.evaluate()`.