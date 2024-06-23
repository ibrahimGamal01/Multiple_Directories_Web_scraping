// const fs = require('fs');

// // Read the JSON file
// const rawData = fs.readFileSync('45.Data.json');
// const theaters = JSON.parse(rawData);

// // Define a function to extract name, address, and number
// function extractInfo(theater) {
//     const info = theater.name.split('\n');
//     const name = info[0].trim();
//     const address = info[1]?.trim() || 'Address not available'; // Check if address exists
//     const number = info[2]?.trim() || 'Number not available'; // Check if number exists
//     return { name, address, number };
// }

// // Extract info for each theater
// const theaterInfo = theaters.map(theater => extractInfo(theater));

// console.log(theaterInfo);

const fs = require('fs');

// Read the JSON file
const rawData = fs.readFileSync('45.Data.json');
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

console.log(theaterInfo);
