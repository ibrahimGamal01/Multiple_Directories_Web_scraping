const fs = require('fs');

// Read the JSON file
const rawData = fs.readFileSync('format1.json');
const theaters = JSON.parse(rawData);

// Define a function to clean up address and number
function cleanInfo(info) {
    const addressMatch = info.match(/[^\n]+, [A-Z]{2} [\d-]+/); // Regex to match address
    const address = addressMatch ? addressMatch[0].trim() : 'Address not available';

    const numberMatch = info.match(/\(\d{3}\) \d{3}-\d{4}/); // Regex to match phone number
    const number = numberMatch ? numberMatch[0].trim() : 'Number not available';

    return { address, number };
}

// Define a function to extract name, address, and number
function extractInfo(theater) {
    const info = theater.name.split('\n')[0]; // Extract name only
    const cleanedInfo = cleanInfo(theater.name); // Clean address and number
    return { name: info.trim(), ...cleanedInfo };
}

// Extract info for each theater
const theaterInfo = theaters.map(theater => extractInfo(theater));

// Convert theaterInfo array to JSON format
const jsonData = JSON.stringify(theaterInfo, null, 2);

// Write JSON data to a file (optional)
fs.writeFileSync('45.Data.3.json', jsonData);

console.log('Theater information extracted and saved to theaterInfo.json.');
