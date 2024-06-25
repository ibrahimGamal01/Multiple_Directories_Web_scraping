// const fs = require('fs');

// function processDeletedRecords(inputFilePath, outputFilePath) {
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

//         const processedRecords = jsonData.map(item => {
//             const name = item.name.replace(/\bMr\b/g, 'Mr').replace(/\bTom\b/g, 'Tom').replace(/\b&\b/g, '&');
//             const phoneRegex = /(\d{3})-(\d{3})-(\d{4})/;
//             const phoneMatch = item.phone.match(phoneRegex);
//             const phone = phoneMatch ? `${phoneMatch[1]}-${phoneMatch[2]}-${phoneMatch[3]}` : '';
//             return { name, phone };
//         });

//         fs.writeFile(outputFilePath, JSON.stringify(processedRecords, null, 2), (writeErr) => {
//             if (writeErr) {
//                 console.error('Error writing the processed file:', writeErr);
//                 return;
//             }
//             console.log('Processed data has been written to', outputFilePath);
//         });
//     });
// }

// const inputFilePath = './39.Data.deleted.json';
// const outputFilePath = './39.Data.processed.json';

// processDeletedRecords(inputFilePath, outputFilePath);


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
            let name = item.name;
            let phone = '';
            if (phoneMatch) {
                phone = phoneMatch[1];
                name += ' ' + item.phone.replace(phoneRegex, '').trim();
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
