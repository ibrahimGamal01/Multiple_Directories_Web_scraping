const fs = require('fs');

// Function to read and process the JSON data
function processJsonFile(inputFilePath, outputFilePath) {
  fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // Process each item in the JSON array
      jsonData.forEach(item => {
        // If address is null, use description2 as the address
        if (item.address === null) {
          item.address = item.description2;
        }
      });

      // Write the updated data to a new JSON file
      fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8', writeErr => {
        if (writeErr) {
          console.error('Error writing the file:', writeErr);
          return;
        }
        console.log('File has been written successfully.');
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}

// Replace '25.Data.json' with the path to your input JSON file
// and '25.Data.updated.json' with the path to your output JSON file
const inputFilePath = '25.Data.json';
const outputFilePath = '25.Data.updated.json';
processJsonFile(inputFilePath, outputFilePath);
