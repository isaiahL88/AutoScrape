import puppeteer from "puppeteer";

async function scrape() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.ca/Best-Sellers-Amazon-Devices-Accessories/zgbs/amazon-devices/ref=zg_bs_nav_amazon-devices_0', {
        waitUntil: "load"
    });

    const is_disabled = await page.$('.a-last.a-disabled') !== null;
    console.log(is_disabled);




    await browser.close();
}

scrape();