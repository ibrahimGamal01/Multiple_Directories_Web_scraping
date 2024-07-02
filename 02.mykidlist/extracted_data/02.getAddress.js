const fs = require('fs');

// Function to extract address from details
function extractAddress(details) {
  const splitDetails = details.split('\n');
  const address = splitDetails[0].trim();
  const remainingDetails = splitDetails.slice(1).join('\n').trim();
  return { address, remainingDetails };
}

// Read the JSON file
fs.readFile('02.Data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let places = JSON.parse(data);

  // Extract address from each entry's details, add the address attribute, and update the details
  places = places.map(place => {
    if (place.details) {
      const { address, remainingDetails } = extractAddress(place.details);
      place.address = address;
      place.details = remainingDetails;
    } else {
      place.address = null;
    }
    return place;
  });

  // Convert the modified data back to JSON
  const updatedData = JSON.stringify(places, null, 2);

  // Write the modified data back to the file
  fs.writeFile('02.Data.json', updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});
