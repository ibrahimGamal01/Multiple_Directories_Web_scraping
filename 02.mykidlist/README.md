## Web Scraper for MyKidList

This script, `02.mykidlist.js`, is a web scraper that extracts data from the MyKidList website. 

### Highlight

> The data extracted from this site is less structured as it is a blog.
> Done it the best way possible as the blog does not have any proper structuring.
> Even in the future, you cannot be sure it will work on similar blogs as the blog is like a chat.

This data is then saved in a JSON format. The JSON data is saved to `02.Data.json`.


### How to Use

1. Ensure you have Node.js installed on your machine.
2. Install the necessary dependencies by running `npm install puppeteer`.
3. Run the script with `node 02.mykidlist.js`.
4. Then run the script `node 02.getAddress.js`.
5. Then run the script `02.getPhone.js`.

### Error Handling

If an error occurs during the scraping process, the error will be logged to the console and the browser will be closed. If the data is successfully scraped but an error occurs while writing the data to a file, the error will be logged to the console.
