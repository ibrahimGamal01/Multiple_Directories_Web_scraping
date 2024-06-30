const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://indoorskydivingsource.com/tunnels/', { waitUntil: 'networkidle2' });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map(row => {
      const statusIcon = row.querySelector('td:nth-child(1) i');
      const status = statusIcon && statusIcon.classList.length ? 'Open to the Public' : 'Private';
      const tunnelName = row.querySelector('td:nth-child(2) b').innerText;
      const tunnelLink = row.querySelector('td:nth-child(2) a').href;
      const country = row.querySelector('td:nth-child(3)').innerText.trim();
      const size = row.querySelector('td:nth-child(4)').innerText.trim();
      const opened = row.querySelector('td:nth-child(5)').innerText.trim();
      const manufacturer = row.querySelector('td:nth-child(6) a') ? row.querySelector('td:nth-child(6) a').innerText : 'N/A';
      
      return {
        status,
        tunnelName,
        tunnelLink,
        country,
        size,
        opened,
        manufacturer
      };
    });
  });

  fs.writeFileSync('tunnels.json', JSON.stringify(data, null, 2));

  await browser.close();
})();
