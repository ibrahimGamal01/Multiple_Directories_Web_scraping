const fs = require('fs');

// Read the JSON file
fs.readFile('48.Data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let zoos = JSON.parse(data);

  // Process each zoo entry to remove the accreditation information from the location
  zoos = zoos.map(zoo => {
    const locationParts = zoo.location.split('Accredited through');
    zoo.location = locationParts[0].trim(); // Keep only the location part
    return zoo;
  });

  // Convert the modified data back to JSON
  const updatedData = JSON.stringify(zoos, null, 2);

  // Write the modified data back to the file
  fs.writeFile('48.Data.json', updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});
