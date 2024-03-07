import puppeteer from "puppeteer-core";

async function scrapeProductInfo() {
    const auth = 'brd-customer-hl_a11b3795-zone-scraping_browser1:08mbpufx5pal';

    let browser;
    try {
        //connect to browser
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
            headless: false
        });


        //setup page
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);
        await page.goto('https://partsavatar.ca/doors');

        const productInfo = await page.$$eval('.m-b-10', elements => {
            return elements.map(element => {
                const name = element.querySelector('.m-0').textContent.trim();
                const price = element.querySelector('.m-b-5').textContent.trim();
                return { name, price };
            });
        });
        console.log(productInfo);
    } catch (e) {
        console.log('scrape failed: ' + e.message, 0);
    } finally {
        await browser?.close();
    }

}

scrapeProductInfo();