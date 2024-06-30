const fs = require('fs');

function reformatEntry(entry) {
    const phonePattern = /\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/;
    const phoneMatch = entry.phone.match(phonePattern);
    
    if (phoneMatch) {
        const phone = phoneMatch[0];
        const nameWithAddress = entry.phone.replace(phone, '').trim();
        return {
            name: `${entry.name}${nameWithAddress}`,
            phone: phone
        };
    }
    
    return entry; // If no phone number found, return the original entry
}

function reformatData(inputFile, outputFile) {
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

    const reformattedData = data.map(reformatEntry);

    fs.writeFileSync(outputFile, JSON.stringify(reformattedData, null, 2));
    console.log(`Reformatted data has been written to ${outputFile}`);
}

const inputFilePath = '39.Data.deleted.json';
const outputFilePath = 'reformatted_data.json';

reformatData(inputFilePath, outputFilePath);
