# Indoor Climbing Gyms Data Extractor

This project contains scripts that extract data about indoor climbing gyms from a specified website. The data extraction process is divided into two parts:

## File Structure

- `26.extractLink.js`: This script navigates through the website and extracts the links to each individual gym's page. The links are then saved to a text file named `gym_links.txt`.

- `26.ExtractData.js`: This script reads the links from `gym_links.txt`, navigates to each link, and extracts the available data. The extracted data is then saved to a JSON file named `climbing_gyms.json`.

## How it Works

The scripts use Puppeteer, a Node.js library, to launch a headless browser and navigate to the specified URLs. They then use the browser's DOM API to extract data from the webpage's HTML.

### `26.extractLink.js`

This script navigates through the website and extracts the links to each individual gym's page. The links are then saved to a text file named `gym_links.txt`.

### `26.ExtractData.js`

This script reads the links from `gym_links.txt`, navigates to each link, and extracts the available data. The extracted data includes the gym's name, address, phone number, website, and description. The data is then saved to a JSON file named `climbing_gyms.json`.

## Usage

To run the scripts, you need to have Node.js installed on your machine. You can then run the scripts using the following commands:

```bash
node 26.extractLink.js
node 26.ExtractData.js
```

After the scripts have finished running, you can find the extracted links in the `gym_links.txt` file and the extracted data in the `climbing_gyms.json` file.
### 1988 items extracted

## Dependencies

- Puppeteer: For launching a headless browser and navigating to the webpage.
- fs (File System): Node.js built-in module for interacting with the file system. It's used here to read the links from a file and write the extracted data to a file.

## Error Handling

If an error occurs during the execution of the scripts, it will be logged to the console.