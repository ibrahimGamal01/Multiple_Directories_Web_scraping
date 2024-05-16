const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scrapeMembersDirectory() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ukpba.org.uk/members-directory/');

    const memberData = await page.evaluate(() => {
        const members = Array.from(document.querySelectorAll('.member-container'));

        const memberInfo = members.map(member => {
            const logo = member.querySelector('.logo').src;
            const title = member.querySelector('.member-title').innerText;
            const content = member.querySelector('.member-content').innerText;

            const contactInfo = {};
            const contactList = member.querySelectorAll('.contact-info li');
            contactList.forEach(item => {
                const key = item.querySelector('span').innerText.trim().replace(':', '');
                const value = item.innerText.trim().replace(key + ':', '').trim();
                contactInfo[key] = value;
            });

            return {
                logo,
                title,
                content,
                contactInfo
            };
        });

        return memberInfo;
    });

    await browser.close();
    return memberData;
}

async function saveDataToFile(data) {
    try {
        await fs.writeFile('members_data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to members_data.json');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function scrapeAndSaveData() {
    try {
        const memberData = await scrapeMembersDirectory();
        await saveDataToFile(memberData);
    } catch (error) {
        console.error('Error scraping data:', error);
    }
}

// Usage
scrapeAndSaveData();
