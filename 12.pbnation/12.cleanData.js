const fs = require('fs');

function separatePhoneFromAddress(data) {
    return data.map(entry => {
        // Extract the phone number using a regular expression
        const phoneMatch = entry.address.match(/\(\d{3}\) \d{3}-\d{4}/);
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

const inputJsonFile = 'extracted_data.json';
const outputJsonFile = '12.Data.json';
processJsonFile(inputJsonFile, outputJsonFile);
