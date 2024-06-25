const fs = require('fs');

function processRecords(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return;
        }

        const processedRecords = jsonData.map(item => {
            // Extract the part of the name that needs to be moved to the address
            const nameParts = item.name.split(/(\d.*)/);
            const name = nameParts[0].trim();
            const nameExtra = nameParts[1] ? nameParts[1].trim() : '';

            // Extract the phone number from the address
            const phoneRegex = /(\d{3})-(\d{3})-(\d{4})/;
            const phoneMatch = item.address.match(phoneRegex);
            const phone = phoneMatch ? phoneMatch[0] : '';

            // Remove the phone number from the address and add the name extra part
            let address = item.address.replace(phone, '').trim();
            if (nameExtra) {
                address = `${nameExtra} ${address}`.trim();
            }

            return { name, address, phone };
        });

        fs.writeFile(outputFilePath, JSON.stringify(processedRecords, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing the processed file:', writeErr);
                return;
            }
            console.log('Processed data has been written to', outputFilePath);
        });
    });
}

const inputFilePath = './46.Data.json';
const outputFilePath = './46.Data.processed.json';

processRecords(inputFilePath, outputFilePath);
