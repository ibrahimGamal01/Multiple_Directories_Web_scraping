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

// Read the JSON file
fs.readFile('./29.Data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Parse JSON data
        const climbingGyms = JSON.parse(data);

        // Function to clean phone numbers
        function cleanPhoneNumber(phone) {
            // Trim the phone number to remove leading and trailing spaces
            if (typeof phone === 'string') {
                phone = phone.trim();
                // Return the phone number if it starts with '+', otherwise return null
                return phone.startsWith('+') ? phone : null;
            }
            return null;
        }

        // Process each entry and clean phone numbers
        climbingGyms.forEach(gym => {
            gym.phone = cleanPhoneNumber(gym.phone);
        });

        // Output the modified data
        console.log(JSON.stringify(climbingGyms, null, 2));

        // Optionally, write the modified data back to a new file
        fs.writeFile('./29.Data.cleaned.json', JSON.stringify(climbingGyms, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Cleaned data saved to 29.Data.cleaned.json');
            }
        });

    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
