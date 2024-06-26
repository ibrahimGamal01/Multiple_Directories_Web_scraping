const fs = require('fs');
const path = require('path');

// Directory where the JSON files are stored
const directoryPath = './'; // Change this to your directory path if different

// Output file name
const outputFileName = '55.Data.json';

// Read all files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.error('Unable to scan directory:', err);
    }

    let combinedData = [];

    files.forEach((file) => {
        // Only process JSON files that match the pattern
        if (file.startsWith('museums_data_') && file.endsWith('.json')) {
            const filePath = path.join(directoryPath, file);
            const fileData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);

            combinedData = combinedData.concat(jsonData);
        }
    });

    // Write combined data to a new JSON file
    fs.writeFileSync(outputFileName, JSON.stringify(combinedData, null, 2), (err) => {
        if (err) {
            return console.error('Error writing combined file:', err);
        }
        console.log(`Data successfully written to ${outputFileName}`);
    });
});
