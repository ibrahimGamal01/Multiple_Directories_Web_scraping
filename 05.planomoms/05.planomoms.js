const puppeteer = require('puppeteer');

async function scrapeIndoorPlaces(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const hrElements = Array.from(document.querySelectorAll('hr.wp-block-separator.has-css-opacity'));

            const placesData = {};

            hrElements.forEach(hr => {
                const prevElements = [];
                let prevElement = hr.previousElementSibling;
                while (prevElement && prevElement.tagName !== 'HR') {
                    prevElements.unshift(prevElement);
                    prevElement = prevElement.previousElementSibling;
                }

                const nextElements = [];
                let nextElement = hr.nextElementSibling;
                while (nextElement && nextElement.tagName !== 'HR') {
                    nextElements.push(nextElement);
                    nextElement = nextElement.nextElementSibling;
                }

                const prevText = prevElements.map(el => el.textContent.trim()).join('\n');
                const nextText = nextElements.map(el => el.textContent.trim()).join('\n');

                const titleElement = hr.previousElementSibling.querySelector('h3.wp-block-heading[id]');
                const title = titleElement ? titleElement.textContent.trim() : '';

                placesData[title] = {
                    beforeHr: prevText,
                    afterHr: nextText
                };
            });

            return placesData;
        });

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return null;
    }
}

const url = 'https://planomoms.com/30-indoor-places-around-plano-for-kids/';
scrapeIndoorPlaces(url)
    .then(data => {
        if (data) {
            console.log(data);
        } else {
            console.log('No data scraped.');
        }
    })
    .catch(error => console.error('Error:', error));
