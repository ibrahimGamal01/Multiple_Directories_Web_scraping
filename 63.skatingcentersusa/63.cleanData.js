const fs = require('fs');
const path = require('path');

// Function to clean the data
function cleanData(data) {
    const cleanedData = data.map(entry => {
        const content = entry.content.trim();

        // Skip entries with too few words
        if (content.split(' ').length <= 2) return null;

        // Extract the name (first two words)
        const name = content.split(' ').slice(0, 2).join(' ');

        // Extract the phone number (pattern ***-***-****)
        const phoneMatch = content.match(/\d{3}-\d{3}-\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : null;

        // Extract the address (content between name and phone)
        const address = content.replace(name, '').replace(phone, '').trim();

        return { name, address, phone };
    });

    // Filter out null values (skipped entries)
    return cleanedData.filter(entry => entry !== null);
}

// Read input data from output.json
const inputFilePath = path.join(__dirname, '63.Data.json');
const inputData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

// Process and clean the data
const cleanedData = cleanData(inputData);

// Write cleaned data to 63.Data.json
const outputFilePath = path.join(__dirname, '63.Data.Cleaned.json');
fs.writeFileSync(outputFilePath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log(`Cleaned data has been written to ${outputFilePath}`);
