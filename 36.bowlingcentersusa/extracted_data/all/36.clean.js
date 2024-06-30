// const fs = require('fs');

// // Read the JSON file
// fs.readFile('36.Data.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }

//   try {
//     // Parse JSON data
//     const bowlingCenters = JSON.parse(data);

//     // Function to extract state and zip code
//     function extractStateAndZip(address) {
//       // Regular expression to match state and zip code patterns
//       const regex = /(?:, |,)([A-Za-z]+) ([0-9-]+)$/;
//       const match = address.match(regex);
//       if (match) {
//         return {
//           state: match[1].trim(),
//           zip: match[2].trim()
//         };
//       } else {
//         return {
//           state: null,
//           zip: null
//         };
//       }
//     }

//     // Process each entry and add state and zip code attributes
//     bowlingCenters.forEach(center => {
//       const address = center.address;
//       const { state, zip } = extractStateAndZip(address);
//       center.state = state;
//       center.zip = zip;
//     });

//     // Output the modified data
//     console.log(JSON.stringify(bowlingCenters, null, 2));

//     // Optionally, write the modified data back to a new file
//     fs.writeFile('36.Data.modified.json', JSON.stringify(bowlingCenters, null, 2), 'utf8', err => {
//       if (err) {
//         console.error('Error writing file:', err);
//       } else {
//         console.log('Modified data saved to 36.Data.modified.json');
//       }
//     });

//   } catch (error) {
//     console.error('Error parsing JSON:', error);
//   }
// });


const fs = require('fs');

// Read the JSON file
fs.readFile('36.Data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse JSON data
    const bowlingCenters = JSON.parse(data);

    // Function to extract state and zip code
    function extractStateAndZip(address) {
      // Regular expression to match state and zip code patterns
      const regex = /(?:, |,)\s*([A-Za-z]+)\s*([0-9- ]+)\s*$/;
      const match = address.match(regex);
      if (match) {
        // Remove any internal spaces from the zip code
        const zip = match[2].replace(/\s+/g, '');
        return {
          state: match[1].trim(),
          zip: zip
        };
      } else {
        return {
          state: null,
          zip: null
        };
      }
    }

    // Process each entry and add state and zip code attributes
    bowlingCenters.forEach(center => {
      const address = center.address;
      const { state, zip } = extractStateAndZip(address);
      center.state = state;
      center.zip = zip;
    });

    // Output the modified data
    console.log(JSON.stringify(bowlingCenters, null, 2));

    // Optionally, write the modified data back to a new file
    fs.writeFile('36.Data.modified.json', JSON.stringify(bowlingCenters, null, 2), 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Modified data saved to 36.Data.modified.json');
      }
    });

  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
