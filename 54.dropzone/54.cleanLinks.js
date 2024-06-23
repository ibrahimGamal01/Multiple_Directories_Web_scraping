const fs = require('fs');
const path = './54.locations.txt';

// Read the file
fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading the file: ${err}`);
        return;
    }

    // Split the file content by newlines to get an array of URLs
    let urls = data.split('\n');

    // Remove duplicates by converting the array to a Set, then back to an array
    let uniqueUrls = [...new Set(urls)];

    // Join the array back into a string with newlines
    let uniqueData = uniqueUrls.join('\n');

    // Write the unique URLs back to the file
    fs.writeFile(path, uniqueData, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing the file: ${err}`);
            return;
        }
        console.log('Duplicates removed successfully.');
    });
});



