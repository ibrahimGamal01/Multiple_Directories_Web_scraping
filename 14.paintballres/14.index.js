// ! Base code 

// const puppeteer = require('puppeteer');

// async function extractInformation(url) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         console.log('Navigating to the URL:', url);
//         await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

//         const result = await page.evaluate(() => {
//             const imgLink = document.querySelector('.content').querySelector('img').src;
//             const addressParts = Array.from(document.querySelectorAll('.content > div > br')).map(br => br.nextSibling.textContent.trim());
//             const [fieldPart1, fieldPart2, fieldPart3, fieldPart4, fieldPart5] = addressParts.filter(part => part.trim().length > 0);

//             return {fieldPart1, fieldPart2, fieldPart3, fieldPart4, imgLink};
//         });

//         console.log('Extracted Data:', result);

//         return result;
//     } catch (error) {
//         console.error('Error during extraction:', error);
//         return null;
//     } finally {
//         await browser.close();
//     }
// }

// // Example usage
// extractInformation('https://paintballreservations.com/adventure_paintball_park/').then(data => {
//     if (data) {
//         console.log('Name:', data.name);
//         console.log('Field Part 1:', data.fieldPart1);
//         console.log('Field Part 2:', data.fieldPart2);
//         console.log('Field Part 3:', data.fieldPart3);
//     } else {
//         console.log('Failed to extract data.');
//     }
// }).catch(error => console.error('Error:', error));



// ! Full code 

const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractInformation(url, retryCount = 3) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        console.log('Navigating to the URL:', url);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

        const result = await page.evaluate(() => {
            const imgLink = document.querySelector('.content').querySelector('img').src;
            const addressParts = Array.from(document.querySelectorAll('.content > div > br')).map(br => br.nextSibling.textContent.trim());
            const [location_name, address, city, county] = addressParts.filter(part => part.trim().length > 0);

            return { location_name, address, city, county, imgLink };
        });

        console.log('Extracted Data:', result);

        return result;
    } catch (error) {
        console.error('Error during extraction:', error);

        if (retryCount > 0) {
            console.log(`Retrying ${retryCount} more times for URL: ${url}`);
            await page.close();
            await browser.close();
            return extractInformation(url, retryCount - 1);
        } else {
            console.log(`Failed to extract data after retries for URL: ${url}`);
            await browser.close();
            return null;
        }
    } finally {
        await browser.close();
    }
}

async function runExtractionFromFile(inputFile) {
    const urls = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
    const extractedData = [];

    for (const url of urls) {
        const data = await extractInformation(url);
        if (data) {
            extractedData.push(data);
        } else {
            console.log(`Failed to extract data for URL: ${url}`);
        }
    }

    const outputFile = 'extracted_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    console.log(`Extraction completed. Data saved to ${outputFile}`);
}

// Example usage
runExtractionFromFile('14.fieldsLinks.txt').catch(error => console.error('Error:', error));
