const fs = require('fs');

// Function to separate phone number from address
function separatePhoneFromAddress(data) {
  return data.map(entry => {
    // Updated regular expression to match more phone number formats
    const phoneMatch = entry.address.match(/(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
    const phone = phoneMatch ? phoneMatch[0] : null;

    // Remove the phone number from the address
    const address = phone ? entry.address.replace(phone, '').trim() : entry.address;

    return {
      ...entry,
      address,
      phone
    };
  });
}

// Function to process the JSON file
async function processJsonFile(inputFile, outputFile) {
  try {
    const jsonData = fs.readFileSync(inputFile, 'utf8');
    const data = JSON.parse(jsonData);

    const processedData = separatePhoneFromAddress(data);

    fs.writeFileSync(outputFile, JSON.stringify(processedData, null, 2));
    console.log(`Data has been processed and written to ${outputFile} successfully.`);
  } catch (error) {
    console.error('Error:', error);
  }
}

const inputJsonFile = '36.Data.json';
const outputJsonFile = 'processed_data.json';
processJsonFile(inputJsonFile, outputJsonFile);
