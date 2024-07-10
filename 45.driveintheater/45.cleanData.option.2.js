// Cleaning up option 2 

const fs = require('fs');

// Read the JSON file
const rawData = fs.readFileSync('format1.json');
const data = JSON.parse(rawData);

// Function to clean each entry
const cleanData = data.map(entry => {
    // Extract name
    let name = entry.name.split('\n')[0].trim();

    // Initialize address and phone
    let address = '';
    let phone = '';

    // Check if there are multiple lines to split
    if (entry.name.includes('\n')) {
        // Extract address
        if (entry.name.split('\n')[1]) {
            address = entry.name.split('\n')[1].trim();
        }
        // Extract phone number
        if (entry.name.split('\n')[2]) {
            phone = entry.name.split('\n')[2].trim();
        }
    }

    // Return cleaned entry
    return {
        name: name,
        address: address,
        phone: phone
    };
});

// Write cleaned data back to a new JSON file
fs.writeFileSync('45.Data.2.json', JSON.stringify(cleanData, null, 2));

console.log('Data cleaned and saved to cleaned_format1.json');
