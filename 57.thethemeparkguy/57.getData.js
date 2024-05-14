// const fs = require('fs');
// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();

//     await page.goto('https://www.thethemeparkguy.com/park/crocosaurus-cove/');

//     const parkData = await page.evaluate(() => {
//         const parkInfoElement = document.querySelector('.parkInfo');

//         const name = parkInfoElement.querySelector('.themepark_info').innerText.trim();

//         const websiteLink = parkInfoElement.querySelector('a[target="_blank"]').href;

//         return { name, websiteLink };
//     });

//     const dataString = `Name: ${parkData.name}\nWebsite Link: ${parkData.websiteLink}\nLocation Link: ${parkData.locationLink}\n`;

//     fs.writeFileSync('parkData.txt', dataString);

//     console.log('Data extracted and saved to parkData.txt');

//     await browser.close();
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
        await page.goto(link);
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

      return { name, websiteLink };
    });

    parkDataList.push(parkData);
  }

  const dataString = JSON.stringify(parkDataList, null, 2);

  fs.writeFileSync("parkData.json", dataString);

  console.log("Data extracted and saved to parkData.json");

  await browser.close();
})();
