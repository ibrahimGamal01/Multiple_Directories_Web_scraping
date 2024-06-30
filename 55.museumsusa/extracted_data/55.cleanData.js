const fs = require('fs');

// Read the JSON file
fs.readFile('55.Data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let museums = JSON.parse(data);

  // Process each museum entry to modify the museumTypes attribute
  museums = museums.map(museum => {
    if (Array.isArray(museum.museumTypes)) {
      museum.museumTypes = museum.museumTypes.join(', ');
    }
    return museum;
  });

  // Convert the modified data back to JSON
  const updatedData = JSON.stringify(museums, null, 2);

  // Write the modified data back to the file
  fs.writeFile('55.cleanData.json', updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});
