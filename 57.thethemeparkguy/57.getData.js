// const fs = require("fs");
// const puppeteer = require("puppeteer");

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   // Read the links from links.txt
//   const links = fs
//     .readFileSync("links.txt", "utf8")
//     .split("\n")
//     .filter((link) => link.trim() !== "");

//   const parkDataList = [];

//   for (const link of links) {
//     let retries = 3;
//     while (retries > 0) {
//       try {
//         await page.goto(link);
//         break; // Break the loop if navigation is successful
//       } catch (error) {
//         console.error("Navigation failed, retrying...");
//         retries--;
//       }
//     }

//     const parkData = await page.evaluate(() => {
//       const parkInfoElement = document.querySelector(".parkInfo");

//       const name = parkInfoElement
//         .querySelector(".themepark_info")
//         .innerText.trim();

//       const websiteLinkElement =
//         parkInfoElement.querySelector('a[target="_blank"]');
//       const websiteLink = websiteLinkElement ? websiteLinkElement.href : "";

//       return { name, websiteLink };
//     });

//     parkDataList.push(parkData);
//   }

//   const dataString = JSON.stringify(parkDataList, null, 2);

//   fs.writeFileSync("parkData.json", dataString);

//   console.log("Data extracted and saved to parkData.json");

//   await browser.close();
// })();


const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Read the links from links.txt
  const links = fs
    .readFileSync("links.txt", "utf8")
    .split("\n")
    .filter((link) => link.trim() !== "");

  const parkDataList = [];

  for (const link of links) {
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 50000 });
        break; // Break the loop if navigation is successful
      } catch (error) {
        console.error("Navigation failed, retrying...");
        retries--;
      }
    }

    const parkData = await page.evaluate(() => {
      const parkInfoElement = document.querySelector(".parkInfo");

      const name = parkInfoElement
        .querySelector(".themepark_info")
        .innerText.trim();

      const websiteLinkElement =
        parkInfoElement.querySelector('a[target="_blank"]');
      const websiteLink = websiteLinkElement ? websiteLinkElement.href : "";

      // Extract location information
      const locationElement = parkInfoElement.querySelector(".themepark_info_location");
      const locationLinks = locationElement ? locationElement.querySelectorAll('a') : [];
      const location = Array.from(locationLinks).map(link => link.innerText).join(", ");

      return { name, websiteLink, location };
    });

    parkDataList.push(parkData);
  }

  const dataString = JSON.stringify(parkDataList, null, 2);

  fs.writeFileSync("parkData.json", dataString);

  console.log("Data extracted and saved to parkData.json");

  await browser.close();
})();
