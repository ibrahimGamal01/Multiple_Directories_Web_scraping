const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to read links from 40.links.txt
const readLinks = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8').split('\n').filter(link => link.trim() !== '');
};

// Function to fetch HTML content
const fetchHTML = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(`Error fetching URL: ${url} - ${error.message}`);
    return null;
  }
};

// Function to parse golf course links from HTML
const parseLinks = (html) => {
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((index, element) => {
    const href = $(element).attr('href');
    if (href) {
      links.push(`https://www.golflink.com${href}`);
    }
  });
  return links;
};

// Main function to process links and extract golf course locations
const processLinks = async (inputFile, outputFile) => {
  const links = readLinks(inputFile);
  const locationLinks = [];

  for (const link of links) {
    const html = await fetchHTML(link);
    console.log(`Processing`);
    if (html) {
        console.log(`Processing ${link}`);
      const parsedLinks = parseLinks(html);
      locationLinks.push(...parsedLinks);
    }
  }

  // Write the extracted links to 40.locations.txt
  fs.writeFileSync(outputFile, locationLinks.join('\n'), 'utf-8');
  console.log(`Extracted ${locationLinks.length} links and saved to ${outputFile}`);
};

// Define input and output file paths
const inputFilePath = '40.links.txt';
const outputFilePath = '40.locations.txt';

// Run the main function
processLinks(inputFilePath, outputFilePath);
