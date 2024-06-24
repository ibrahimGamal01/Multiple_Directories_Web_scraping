const fs = require('fs');
const cheerio = require('cheerio');

function extractBowlingCenters(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const centers = [];

  $('.LocationListBox .FAC-Result').each((i, el) => {
    const name = $(el).find('h3 a').text().trim();
    
    // Extract address
    const addressElement = $(el).find('p').eq(1).find('span').first().html();
    const address = addressElement ? addressElement.replace(/<br>/g, ', ').trim() : '';

    // Extract phone number
    const phoneElement = $(el).find('p').eq(1).find('span.fa-fw').parent().text();
    const phone = phoneElement.replace('', '').trim();

    // Extract image links
    const imgLinks = {};
    $(el).find('.panel-body a img').each((index, img) => {
      const link = $(img).attr('src');
      imgLinks[`link${index + 1}`] = link;
    });

    centers.push({
      name,
      address,
      phone,
      imgLinks
    });
  });

  return centers;
}

function main() {
  const filePath = './bowling_centers.html';
  const centers = extractBowlingCenters(filePath);

  fs.writeFileSync('./bowling_centers_data.json', JSON.stringify(centers, null, 2), 'utf-8');
  console.log('Data has been written to bowling_centers_data.json');
}

main();
