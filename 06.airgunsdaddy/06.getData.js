// // // const axios = require('axios');
// // // const cheerio = require('cheerio');

// // // const url = 'https://airgunsdaddy.com/directory/fields/';

// // // axios.get(url)
// // //     .then(response => {
// // //         const $ = cheerio.load(response.data);
// // //         const fields = [];

// // //         $('.tve-cb[data-css="tve-u-18766afd1d9"]').each((i, element) => {
// // //             const field = {};
            
// // //             const nameElement = $(element).find('h3 a');
// // //             field.name = nameElement.text().trim();
// // //             field.website = nameElement.attr('href');

// // //             field.logoLink = $(element).find('img').attr('src');

// // //             const tabs = $(element).find('.tve_tab_content');
// // //             field.about = tabs.eq(1).text().trim();
// // //             field.address = tabs.eq(2).text().trim();

// // //             const contactInfo = $(element).find('.thrv-styled_list').eq(0).find('li');
// // //             field.phone = contactInfo.eq(0).text().trim().replace('Phone:', '').trim();
// // //             field.mail = contactInfo.eq(1).text().trim().replace('Email:', '').trim();

// // //             field.addressLink = $(element).find('a[href*="maps"]').attr('href');

// // //             // Additional fields if available
// // //             field.rating = $(element).find('.thrv_rating').attr('data-value');
// // //             field.capacity = $(element).find('.tcb-styled-list-icon-text:contains("players capacity")').text().replace('players capacity', '').trim();
// // //             field.space = $(element).find('.tcb-styled-list-icon-text:contains("Playing space")').text().replace('Playing space', '').trim();
// // //             field.areas = $(element).find('.tcb-styled-list-icon-text:contains("Indoor & outdoor areas")').text().replace('Indoor & outdoor areas', '').trim();
// // //             field.rentals = $(element).find('.tcb-styled-list-icon-text:contains("On-site rentals")').text().replace('On-site rentals', '').trim();
// // //             field.retail = $(element).find('.tcb-styled-list-icon-text:contains("On-site retail store")').text().replace('On-site retail store', '').trim();
// // //             field.repairs = $(element).find('.tcb-styled-list-icon-text:contains("Gear repairs & upgrades")').text().replace('Gear repairs & upgrades', '').trim();
// // //             field.repairShop = $(element).find('.tcb-styled-list-icon-text:contains("On-site repair shop")').text().replace('On-site repair shop', '').trim();
// // //             field.refills = $(element).find('.tcb-styled-list-icon-text:contains("Tank refills")').text().replace('Tank refills', '').trim();

// // //             fields.push(field);
// // //         });

// // //         console.log(JSON.stringify(fields, null, 4));
// // //     })
// // //     .catch(error => {
// // //         console.error(`Error fetching data: ${error.message}`);
// // //     });

// // const axios = require('axios');
// // const cheerio = require('cheerio');

// // const url = 'https://airgunsdaddy.com/directory/fields/';

// // axios.get(url)
// //     .then(response => {
// //         const html = response.data;
// //         const $ = cheerio.load(html);

// //         const extractData = () => {
// //             const data = [];
            
// //             $('.tcb-flex-row').each((index, element) => {
// //                 const name = $(element).find('.tve_image_caption img').attr('alt');
// //                 const logoLink = $(element).find('.tve_image_caption img').attr('src');
// //                 const about = $(element).find('.thrv_text_element p').text();
// //                 const addressElement = $(element).find('.thrv_text_element').next();
// //                 const address = addressElement.text();
// //                 const addressLink = addressElement.find('a').attr('href');
                
// //                 // Collect other data if available (placeholders here)
// //                 const phone = $(element).find('.phone-selector').text() || 'N/A';
// //                 const mail = $(element).find('.mail-selector').text() || 'N/A';
// //                 const website = $(element).find('.website-selector').attr('href') || 'N/A';

// //                 data.push({
// //                     name: name || 'N/A',
// //                     phone: phone,
// //                     mail: mail,
// //                     website: website,
// //                     about: about || 'N/A',
// //                     address: address || 'N/A',
// //                     addressLink: addressLink || 'N/A',
// //                     logoLink: logoLink || 'N/A'
// //                 });
// //             });

// //             return data;
// //         };

// //         const directoryData = extractData();
// //         console.log(JSON.stringify(directoryData, null, 2));
// //     })
// //     .catch(error => {
// //         console.error('Error fetching the webpage:', error);
// //     });


// const axios = require('axios');
// const cheerio = require('cheerio');
// const fs = require('fs');

// const url = 'https://airgunsdaddy.com/directory/fields/';

// axios.get(url)
//     .then(response => {
//         const html = response.data;
//         const $ = cheerio.load(html);

//         const extractData = () => {
//             const data = [];
            
//             $('.tcb-flex-row').each((index, element) => {
//                 const name = $(element).find('.tve_image_caption img').attr('alt');
//                 const logoLink = $(element).find('.tve_image_caption img').attr('src');
//                 const about = $(element).find('.thrv_text_element p').text();
//                 const addressElement = $(element).find('.thrv_text_element').next();
//                 const address = addressElement.text();
//                 const addressLink = addressElement.find('a').attr('href');
                
//                 // Collect other data if available (placeholders here)
//                 const phone = $(element).find('.phone-selector').text() || 'N/A';
//                 const mail = $(element).find('.mail-selector').text() || 'N/A';
//                 const website = $(element).find('.website-selector').attr('href') || 'N/A';

//                 data.push({
//                     name: name || 'N/A',
//                     phone: phone,
//                     mail: mail,
//                     website: website,
//                     about: about || 'N/A',
//                     address: address || 'N/A',
//                     addressLink: addressLink || 'N/A',
//                     logoLink: logoLink || 'N/A'
//                 });
//             });

//             return data;
//         };

//         const directoryData = extractData();
        
//         // Write the extracted data to a JSON file
//         fs.writeFileSync('directoryData.json', JSON.stringify(directoryData, null, 2));
//         console.log('Data has been successfully written to directoryData.json');
//     })
//     .catch(error => {
//         console.error('Error fetching the webpage:', error);
//     });
