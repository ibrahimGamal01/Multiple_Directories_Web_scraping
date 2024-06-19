const fs = require('fs');
const path = require('path');

// Define the input and output files
const INPUT_FILE = '58.Data.json';
const OUTPUT_FILE = '58.CleanedData.json';

// Function to clean the address field
function cleanAddress(address) {
    const lines = address.split('\n').map(line => line.trim()).filter(line => line);

    const phoneIndex = lines.findIndex(line => line.toLowerCase().includes('phone') || line.match(/\d{3}-\d{3}-\d{4}/));
    const phone = phoneIndex !== -1 ? lines.splice(phoneIndex, 1)[0].replace('Phone', '').trim() : null;

    const cleanedAddress = {
        street: lines[0] || '',
        city: lines[1] || '',
        state_zip: lines[2] || '',
        phone: phone || ''
    };

    return cleanedAddress;
}

// Function to clean the overview field
function cleanOverview(overview) {
    // Remove unwanted JavaScript code
    const cleanedOverview = overview.replace(/window\.addEventListener\("sfsi_functions_loaded".*?\);/gs, '').trim();

    return cleanedOverview;
}

// Function to clean the data
function cleanData(data) {
    return data.map(item => {
        const cleanedItem = {
            ...item,
            address: cleanAddress(item.address),
            overview: cleanOverview(item.overview)
        };
        return cleanedItem;
    });
}

// Read the input JSON file
fs.readFile(INPUT_FILE, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the input file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Clean the data
        const cleanedData = cleanData(jsonData);

        // Write the cleaned data to the output file
        fs.writeFile(OUTPUT_FILE, JSON.stringify(cleanedData, null, 2), (err) => {
            if (err) {
                console.error('Error writing the output file:', err);
            } else {
                console.log(`Cleaned data has been saved to ${OUTPUT_FILE}`);
            }
        });
    } catch (error) {
        console.error('Error parsing the JSON data:', error);
    }
});
