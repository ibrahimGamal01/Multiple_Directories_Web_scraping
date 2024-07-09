const fs = require('fs/promises');

async function cleanAndTransformData(inputFile, outputFile) {
    try {
        // Step 1: Read the JSON file
        const rawData = await fs.readFile(inputFile, 'utf-8');
        const data = JSON.parse(rawData);

        // Step 2: Clean and transform each entry
        const cleanedData = data.map(entry => {
            // Extract the address
            const address = entry.Address;

            // Split the address by commas and trim spaces
            const addressComponents = address.split(',').map(component => component.trim());

            // Assign components to attr1, attr2, attr3
            const attr1 = addressComponents[0] || 'Unknown';
            const attr2 = addressComponents[1] || 'Unknown';
            const attr3 = addressComponents.slice(2).join(', ') || 'Unknown';

            // Return a new object with transformed data
            return {
                Name: entry.Name,
                Address: entry.Address,
                AddressURL: entry.AddressURL,
                Phone: entry.Phone,
                Website: entry.Website,
                Street: attr1,
                City: attr2,
                ZipCode: attr3
            };
        });

        // Step 3: Write cleaned data to a new JSON file
        await fs.writeFile(outputFile, JSON.stringify(cleanedData, null, 2));
        console.log(`Data has been cleaned and saved to ${outputFile}`);
    } catch (error) {
        console.error('Error cleaning data:', error);
    }
}

// Replace with your input and output file paths
const inputFile = '70.Data.json';
const outputFile = '70.cleaned.Data.json';

// Run the cleaning function
cleanAndTransformData(inputFile, outputFile);
