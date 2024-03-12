import puppeteer from "puppeteer";
import fs from 'fs'

async function scrape() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    })

    const page = await browser.newPage();
    await page.goto('https://www.amazon.ca/Best-Sellers-Amazon-Devices-Accessories/zgbs/amazon-devices/ref=zg_bs_nav_amazon-devices_0');


    let isBtnDisabled = false;

    while (!isBtnDisabled) {
        let title = "Null";
        let price = "Null";
        let image = "NUll";


        //find all product containers
        const productHandles = await page.$$('.a-column');

        //parse all product container data
        for (const productHandle of productHandles) {
            try {
                title = await page.evaluate(el => el.querySelector('a > span > div').textContent, productHandle);
            } catch (err) { }
            try {
                price = await page.evaluate(
                    // extra selector .a-color-price
                    (el) => el.querySelector('.a-size-base > span').textContent,
                    productHandle
                );
            } catch (err) { }

            try {
                image = await page.evaluate(
                    (el) => el.querySelector('.a-dynamic-image').getAttribute("src"),
                    productHandle
                );
            } catch (err) { }

            if (title != "Null") {
                fs.appendFile('results.csv', `\n${title},${price},${image} `, function (err) {
                    if (err) throw err;
                    console.log("Saved!");
                });
            }
        }

        const is_disabled = await page.$('.a-last.a-disabled') !== null;
        isBtnDisabled = is_disabled;
        if (!isBtnDisabled) {
            await page.click('.a-last');
        }
    }



};

scrape();