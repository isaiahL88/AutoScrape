import puppeteer from "puppeteer";

async function scrape() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    })

    const page = await browser.newPage();
    await page.goto('https://www.amazon.ca/Best-Sellers-Amazon-Devices-Accessories/zgbs/amazon-devices/ref=zg_bs_nav_amazon-devices_0');

    const productHandles = await page.$$('.a-column');

    let items = [];

    for (const productHandle of productHandles) {
        let title = "Null";
        let price = "Null";
        let image = "NUll";

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
            items.push({ title, price, image })

        }
    }

    console.log(items.length);
    console.log(items);

};

scrape();