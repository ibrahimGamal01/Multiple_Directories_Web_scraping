// const fs = require('fs');

// function isValidPhoneNumber(phone) {
//     const phoneRegex = /^[0-9\s-]+$/;
//     return phoneRegex.test(phone.trim());
// }

// function filterInvalidPhoneRecords(data) {
//     return data.filter(item => {
//         return isValidPhoneNumber(item.phone);
//     });
// }

// function processFile(inputFilePath, outputFilePath) {
//     fs.readFile(inputFilePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading the file:', err);
//             return;
//         }

//         let jsonData;
//         try {
//             jsonData = JSON.parse(data);
//         } catch (parseErr) {
//             console.error('Error parsing JSON data:', parseErr);
//             return;
//         }

//         const filteredData = filterInvalidPhoneRecords(jsonData);

//         fs.writeFile(outputFilePath, JSON.stringify(filteredData, null, 2), (writeErr) => {
//             if (writeErr) {
//                 console.error('Error writing the file:', writeErr);
//                 return;
//             }
//             console.log('Filtered data has been written to', outputFilePath);
//         });
//     });
// }

// const inputFilePath = './39.Data.json';
// const outputFilePath = './39.Data.filtered.json';

// processFile(inputFilePath, outputFilePath);

const fs = require('fs');

function processDeletedRecords(inputFilePath, outputFilePath) {
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
            const phoneRegex = /(\d{3}-\d{3}-\d{4})/;
            const phoneMatch = item.phone.match(phoneRegex);
            const phone = phoneMatch ? phoneMatch[1] : '';
            
            // Extracting the phone number from the name if it's found at the end
            let name = item.name;
            if (phone) {
                name = name.replace(phone, '').trim();
            }

            return { name, phone };
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

const inputFilePath = './39.Data.deleted.json';
const outputFilePath = './39.Data.processed.json';

processDeletedRecords(inputFilePath, outputFilePath);

