const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const outputFilePath = path.join(__dirname, '35.links.txt');
const baseUrl = 'https://bowling.placefull.com/search?pg=';

async function fetchPageLinks(pageNum) {
    try {
        const url = `${baseUrl}${pageNum}&vw=list`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const links = [];

        $('.space-result .space-thumb a').each((_, element) => {
            const href = $(element).attr('href');
            if (href) {
                links.push(`https://bowling.placefull.com${href}`);
            }
        });

        return links;
    } catch (error) {
        console.error(`Error fetching page ${pageNum}: ${error.message}`);
        return [];
    }
}

async function scrapeAllLinks() {
    const allLinks = [];

    for (let pageNum = 1; pageNum <= 73; pageNum++) {
        console.log(`Fetching links from page ${pageNum}...`);
        const pageLinks = await fetchPageLinks(pageNum);
        allLinks.push(...pageLinks);
        console.log(`Fetched ${pageLinks.length} links from page ${pageNum}`);
    }

    const uniqueLinks = [...new Set(allLinks)]; // Remove duplicate links
    fs.writeFileSync(outputFilePath, uniqueLinks.join('\n'), 'utf8');
    console.log(`Scraping complete. Links saved in "${outputFilePath}".`);
}

// Execute the function
scrapeAllLinks();
