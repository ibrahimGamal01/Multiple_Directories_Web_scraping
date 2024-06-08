const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, '70.links.txt');

// Read the file content
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Split the content by new lines and remove duplicates using a Set
    const uniqueLinks = [...new Set(data.split('\n').map(line => line.trim()).filter(line => line.length > 0))];

    // Join the unique links back into a single string with new lines
    const uniqueContent = uniqueLinks.join('\n');

    // Write the unique content back to the file (or to a new file)
    fs.writeFile(filePath, uniqueContent, 'utf8', err => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }

        console.log('Duplicates removed and file updated successfully.');
    });
});
