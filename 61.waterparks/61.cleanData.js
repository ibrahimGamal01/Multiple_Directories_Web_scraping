const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, '61.Data.json');
const outputFilePath = path.join(__dirname, '61.UpdatedData.json');

function parseAddress(fullAddress) {
  const addressLines = fullAddress.split('\n');
  const street = addressLines.slice(1, -2).join(' ');
  const city = addressLines[addressLines.length - 2];
  const country = addressLines[addressLines.length - 1];
  return { fullAddress, street, city, country };
}

function updateParkData(data) {
  return data.map(park => {
    const { fullAddress, street, city, country } = parseAddress(park["Park Name"]);

    return {
      ...park,
      "Park Name": park["Park Address"],
      "Park Address": {
        "Address": fullAddress,
        "Street": street,
        "City": city,
        "Country": country
      }
    };
  });
}

function main() {
  const rawData = fs.readFileSync(inputFilePath, 'utf-8');
  const data = JSON.parse(rawData);

  const updatedData = updateParkData(data);

  fs.writeFileSync(outputFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
  console.log('Data has been written to 61.UpdatedData.json');
}

main();
