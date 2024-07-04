const fs = require('fs');

// Read the JSON file
fs.readFile('20.links.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data
    let links = JSON.parse(data);

    // Use a Set to track unique URLs
    const seenUrls = new Set();
    const uniqueLinks = links.filter(link => {
        if (seenUrls.has(link.url)) {
            return false;
        } else {
            seenUrls.add(link.url);
            return true;
        }
    });

    // Write the unique links back to the file
    fs.writeFile('20.links.unique.json', JSON.stringify(uniqueLinks, null, 2), 'utf8', err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Duplicate URLs removed and unique links saved to 20.links.unique.json');
    });
});
