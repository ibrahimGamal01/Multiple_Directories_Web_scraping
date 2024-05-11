# Airsoft Fields Data Extractor


## File Structure

- `09.extractData.js`: This is the main script that performs the data extraction.

## How it Works

The script uses Puppeteer, a Node.js library, to launch a headless browser and navigate to the specified URL. It then uses the browser's DOM API to extract data from the webpage's HTML.

The data is extracted from a table on the webpage. Each row in the table (excluding the header row) represents an Airsoft field. The script extracts the following information for each field:

- Name
- State
- Type
- Website

The extracted data is then written to a JSON file named `airsoft_fields.json`.

## Usage

To run the script, you need to have Node.js installed on your machine. You can then run the script using the following command:

```bash
node 09.extractData.js
```

After the script has finished running, you can find the extracted data in the `airsoft_fields.json` file.

Website: https://professionalairsoft.fandom.com/wiki/List_of_airsoft_fields_in_the_United_States

## Dependencies

- Puppeteer: For launching a headless browser and navigating to the webpage.
- fs (File System): Node.js built-in module for interacting with the file system. It's used here to write the extracted data to a file.

## Error Handling

If an error occurs during the execution of the script, it will be logged to the console.