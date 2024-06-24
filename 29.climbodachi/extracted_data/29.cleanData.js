// const fs = require('fs');

// function isValidPhoneNumber(phone) {
//     if (phone === null) {
//         return false;
//     }
//     const phoneRegex = /^\+?[0-9\s]+$/;
//     return phoneRegex.test(phone.trim());
// }

// function cleanPhoneNumbers(data) {
//     return data.map(item => {
//         if (!isValidPhoneNumber(item.phone)) {
//             item.phone = '';
//         }
//         return item;
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

//         const cleanedData = cleanPhoneNumbers(jsonData);

//         fs.writeFile(outputFilePath, JSON.stringify(cleanedData, null, 2), (writeErr) => {
//             if (writeErr) {
//                 console.error('Error writing the file:', writeErr);
//                 return;
//             }
//             console.log('Data has been cleaned and written to', outputFilePath);
//         });
//     });
// }

// const inputFilePath = './29.Data.json';
// const outputFilePath = './29.Data.cleaned.json';

// processFile(inputFilePath, outputFilePath);



const fs = require('fs');

function removeContactNumber(data) {
    return data.map(item => {
        if (item.description) {
            const splitDescription = item.description.split('\n');
            const filteredDescription = splitDescription.filter(line => !line.includes('Contact No.:'));
            item.description = filteredDescription.join('\n');
        }
        return item;
    });
}

function processFile(inputFilePath, outputFilePath) {
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

        const cleanedData = removeContactNumber(jsonData);

        fs.writeFile(outputFilePath, JSON.stringify(cleanedData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return;
            }
            console.log('Contact numbers removed and data has been written to', outputFilePath);
        });
    });
}

const inputFilePath = './29.Data.json';
const outputFilePath = './29.Data.cleaned.json';

processFile(inputFilePath, outputFilePath);
