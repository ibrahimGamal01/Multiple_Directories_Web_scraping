// const fs = require("fs");
// const puppeteer = require("puppeteer");

// async function scrapeDataFromLink(url) {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     console.log(`Navigating to ${url}`);
//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

//     const data = await page.evaluate(() => {
//       const nameElement = document.querySelector(".Heading-sc-1w5xk2o-0");
//       const name = nameElement ? nameElement.innerText : null;

//       const imgElement = document.querySelector(
//         ".Image__PictureImage-sc-412cjc-1"
//       );
//       const imgLink = imgElement ? imgElement.src : null;

//       const descriptionElement = document.querySelector(
//         "#ad-in-text-target > .Raw-slyvem-0.ijnuAG:nth-of-type(1) > p"
//       );
//       const description = descriptionElement
//         ? descriptionElement.innerText
//         : null;

//       const addressElement = document.querySelector(
//         ".Raw-slyvem-0.ijnuAG > p > a"
//       );
//       const address = addressElement ? addressElement.innerText : null;

//       return { name, imgLink, description, address };
//     });

//     console.log(`Successfully scraped data from ${url}`);
//     return data;
//   } catch (error) {
//     console.error(`Error scraping ${url}: ${error.message}`);
//     return null;
//   } finally {
//     await browser.close();
//   }
// }

// async function scrapeAllLinks() {
//   try {
//     const url =
//       "https://travel.usnews.com/gallery/the-best-water-parks-in-the-usa?onepage";
//     const scrapedData = [];

//     const data = await scrapeDataFromLink(url);
//     if (data) {
//       scrapedData.push(data);
//     } else {
//       console.error(`Failed to scrape data from ${url}`);
//     }
//     // Delay to avoid being blocked
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     fs.writeFileSync("62.Data.json", JSON.stringify(scrapedData, null, 2));
//     console.log("Scraped data saved to 78.Data.json");
//   } catch (error) {
//     console.error("Error scraping data:", error);
//   }
// }

// // Usage
// scrapeAllLinks();

const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapeDataFromLink(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Scroll down the page to ensure all content is loaded
    await autoScroll(page);

    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll(".one-page-slideshow__Container-sc-12id5uo-0");
      const scrapedData = [];

      elements.forEach((element) => {
        const nameElement = element.querySelector(".Heading-sc-1w5xk2o-0");
        const name = nameElement ? nameElement.innerText : null;

        const imgElement = element.querySelector(".Image__PictureImage-sc-412cjc-1");
        const imgLink = imgElement ? imgElement.src : null;

        const descriptionElement = element.querySelector("#ad-in-text-target > .Raw-slyvem-0.ijnuAG:nth-of-type(1) > p");
        const description = descriptionElement ? descriptionElement.innerText : null;

        const addressElement = element.querySelector(".Raw-slyvem-0.ijnuAG > p > a");
        const address = addressElement ? addressElement.innerText : null;

        scrapedData.push({ name, imgLink, description, address });
      });

      return scrapedData;
    });

    console.log(`Successfully scraped data from ${url}`);
    return data;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    return null;
  } finally {
    await browser.close();
  }
}

// Helper function to auto-scroll the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function scrapeAllLinks() {
  try {
    const url = "https://travel.usnews.com/gallery/the-best-water-parks-in-the-usa?onepage";
    const scrapedData = await scrapeDataFromLink(url);

    if (scrapedData) {
      fs.writeFileSync("62.Data.json", JSON.stringify(scrapedData, null, 2));
      console.log("Scraped data saved to 62.Data.json");
    } else {
      console.error(`Failed to scrape data from ${url}`);
    }
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

// Usage
scrapeAllLinks();
