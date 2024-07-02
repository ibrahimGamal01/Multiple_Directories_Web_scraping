const fs = require('fs');

// Function to extract email addresses from a given string and remove them
function extractEmails(text) {
  const emailRegex = /(?:[a-zA-Z0-9._%+-]+(?:\s*@\s*|\sat\s*|\s\(at\)\s*|\n@\n)[a-zA-Z0-9.-]+(?:\s*\.\s*|\s*\(dot\)\s*|\n\.\n)[a-zA-Z]{2,})/g;
  let emails = text.match(emailRegex);
  if (emails) {
    // Remove any spaces or newlines around @ and .
    emails = emails.map(email => email.replace(/\s*@\s*|\sat\s*|\s*\(at\)\s*/g, '@').replace(/\s*\.\s*|\s*\(dot\)\s*/g, '.').replace(/\n/g, ''));
    // Remove the email addresses from the original text
    text = text.replace(emailRegex, '').replace(/\n{2,}/g, '\n').trim();
  }
  return { emails, text };
}

// Read the JSON file
fs.readFile('58.Data.cleaned.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let museums = JSON.parse(data);

  // Extract email addresses from each museum entry, add the email attribute, and clean the address field
  museums = museums.map(museum => {
    if (museum.address) {
      const { emails, text } = extractEmails(museum.address);
      museum.email = emails && emails.length > 0 ? emails.join(', ') : null;
      museum.address = text;
    } else {
      museum.email = null;
    }
    return museum;
  });

  // Convert the modified data back to JSON
  const updatedData = JSON.stringify(museums, null, 2);

  // Write the modified data back to the file
  fs.writeFile('58.Data.cleaned.json', updatedData, 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('File has been updated successfully.');
  });
});
