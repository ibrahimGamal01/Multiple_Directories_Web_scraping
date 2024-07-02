// // Convert data from arr to txt
// const fs = require('fs');

// // Read the JSON file
// fs.readFile('55.Data.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   // Parse the JSON data
//   let museums = JSON.parse(data);

//   // Process each museum entry to modify the museumTypes attribute
//   museums = museums.map(museum => {
//     if (Array.isArray(museum.museumTypes)) {
//       museum.museumTypes = museum.museumTypes.join(', ');
//     }
//     return museum;
//   });

//   // Convert the modified data back to JSON
//   const updatedData = JSON.stringify(museums, null, 2);

//   // Write the modified data back to the file
//   fs.writeFile('55.cleanData.json', updatedData, 'utf8', err => {
//     if (err) {
//       console.error('Error writing the file:', err);
//       return;
//     }
//     console.log('File has been updated successfully.');
//   });
// });

// // clean
// const fs = require('fs');

// // Read the JSON file
// fs.readFile('55.Data.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading file:', err);
//     return;
//   }

//   // Parse the JSON data
//   let museums = JSON.parse(data);

//   // Iterate through each museum object
//   museums = museums.map(museum => {
//     if (museum.website === null) {
//       museum.website = museum.email;
//       museum.email = null;
//     }
//     return museum;
//   });

//   // Convert the updated data back to JSON
//   const updatedData = JSON.stringify(museums, null, 2);

//   // Write the updated JSON back to the file
//   fs.writeFile('55.Data.json', updatedData, 'utf8', err => {
//     if (err) {
//       console.error('Error writing file:', err);
//       return;
//     }
//     console.log('File has been updated');
//   });
// });


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

    // If website is null, replace it with the email and set email to null
    if (museum.website === null) {
      museum.website = museum.email;
      museum.email = null;
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
