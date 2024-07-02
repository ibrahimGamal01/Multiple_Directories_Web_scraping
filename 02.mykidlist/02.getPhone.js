const fs = require('fs');

const inputFile = '02.Data.json';
const outputFile = '02.Data_with_phone.json';

// Function to extract phone numbers from the details attribute
const extractphone = (details) => {
    const phonePattern = /\(\d{3}\) \d{3}-\d{4}/;
    const match = details.match(phonePattern);
    return match ? match[0] : null;
};

// Read the JSON file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Iterate through each object and add the phone number attribute
    jsonData = jsonData.map(item => {
        const phone = extractphone(item.details);
        return { ...item, phone };
    });

    // Write the updated data to a new JSON file
    fs.writeFile(outputFile, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log(`Data successfully written to ${outputFile}`);
        }
    });
});
