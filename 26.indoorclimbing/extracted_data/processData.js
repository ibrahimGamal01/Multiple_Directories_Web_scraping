const fs = require('fs');

// Read the JSON file
const rawData = fs.readFileSync('26.Data.json');
const gymsData = JSON.parse(rawData);

// Clean the data
const cleanedData = gymsData.map(gym => ({
    city: gym.city,
    name: gym.name,
    address: gym.address,
    phone: cleanPhoneNumber(gym.phone), // Clean the phone number
    website: gym.website,
    description: gym.description
}));

// Write the cleaned data back to the JSON file
fs.writeFileSync('cleaned_data.json', JSON.stringify(cleanedData, null, 2));
console.log('Data has been cleaned and saved to cleaned_data.json');

// Function to clean the phone number
function cleanPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        return null;
    }

    // Remove HTML tags if present
    const cleanedPhone = phone.replace(/<\/?[^>]+(>|$)/g, '');
    
    return cleanedPhone.trim();
}
