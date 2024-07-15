// // Cleaning option 1
// const fs = require('fs');

// // Function to extract address from details
// function extractAddress(details) {
//   const splitDetails = details.split('\n');
//   const address = splitDetails[0].trim();
//   const remainingDetails = splitDetails.slice(1).join('\n').trim();
//   return { address, remainingDetails };
// }

// // Read the JSON file
// fs.readFile('02.Data_with_phone.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   // Parse the JSON data
//   let places = JSON.parse(data);

//   // Extract address from each entry's details, add the address attribute, and update the details
//   places = places.map(place => {
//     if (place.details) {
//       const { address, remainingDetails } = extractAddress(place.details);
//       place.address = address;
//       place.details = remainingDetails;
//     } else {
//       place.address = null;
//     }
//     return place;
//   });

//   // Convert the modified data back to JSON
//   const updatedData = JSON.stringify(places, null, 2);

//   // Write the modified data back to the file
//   fs.writeFile('02.Data.All.json', updatedData, 'utf8', err => {
//     if (err) {
//       console.error('Error writing the file:', err);
//       return;
//     }
//     console.log('File has been updated successfully.');
//   });
// });

// Cleaning option 2

const fs = require('fs');

// Function to extract addresses from details
function extractAddresses(details) {
  const splitDetails = details.split('\n');
  const addresses = [];
  const remainingDetails = [];

  splitDetails.forEach(detail => {
    const trimmedDetail = detail.trim();
    if (/^\d/.test(trimmedDetail)) { // Check if the line starts with a digit
      addresses.push(trimmedDetail);
    } else {
      remainingDetails.push(trimmedDetail);
    }
  });

  return { addresses, remainingDetails: remainingDetails.join('\n').trim() };
}

// Read the JSON file
fs.readFile('02.Data_with_phone.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let places = JSON.parse(data);

  // Extract addresses from each entry's details and add them as separate address attributes
  places = places.map(place => {
    if (place.details) {
      const { addresses, remainingDetails } = extractAddresses(place.details);
      addresses.forEach((address, index) => {
        place[`address${index + 1}`] = address;
      });
      place.details = remainingDetails;
    }
    return place;
  });

  // Convert the modified data back to JSON
  const updatedData = JSON.stringify(places, null, 2);

  // Write the modified data back to the file
  fs.writeFile('02.Data.All.json', updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});
