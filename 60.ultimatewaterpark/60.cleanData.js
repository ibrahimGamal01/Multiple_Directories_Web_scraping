const fs = require('fs');

function capitalizeWords(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

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
            const url = item.url;
            const urlParts = url.split('/');
            const lastPart = urlParts[urlParts.length - 1].replace('.html', '');
            const newTitle = `${item.data.title} - ${capitalizeWords(lastPart)}`;

            return {
                url: item.url,
                data: {
                    ...item.data,
                    title: newTitle
                }
            };
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

const inputFilePath = './60.Data.json';
const outputFilePath = './60.Data.processed.json';

processRecords(inputFilePath, outputFilePath);
