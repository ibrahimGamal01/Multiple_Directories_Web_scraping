const fs = require('fs').promises;

async function reformatData() {
    try {
        // Read the JSON file
        const data = await fs.readFile('theme_parks_details.json', 'utf8');
        const themeParks = JSON.parse(data);

        // Map the data to the new format
        const reformattedData = themeParks.map(park => park.details);

        // Save the reformatted data to a new JSON file
        await fs.writeFile('reformatted_theme_parks.json', JSON.stringify(reformattedData, null, 2));
        console.log('Reformatted data has been written to reformatted_theme_parks.json');
    } catch (error) {
        console.error('Failed to read or write data:', error);
    }
}

reformatData();
