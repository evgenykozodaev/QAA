const puppeteer = require('puppeteer');

const url = "https://www.google.com";
const row = 6;
/**
 * @type {puppeteer.Page}
 */
let page;
/**
 * @type {puppeteer.Browser}
 */
let browser;
const width = 1920;
const height = 1080;

describe("Test google search", () => {
    beforeAll(() => {
        console.log("Before all")

        return puppeteer.launch({
            headless: false,
            slowMo: 100,
            args: [`--window-size=${width},${height}`]
        }).then(result =>{
            browser = result
            return browser.newPage();
        }).then(result => {
            page = result
            return page.setViewport({ width, height });
        });
    });

    afterAll(() => {
        console.log("After all")

        return browser.close();
    });

    it("Open 3rd link", function () {
        return page.goto(url, { waitUntil: "networkidle2" })
            .then(() => page.waitForSelector("form[action='/search'] input[name=q]", { timeout: 2000 }))
            .then(() => page.$eval("form[action='/search'] input[name=q]", el => {
                el.value = "Погода в Минске";
            }))
            .then(() => page.$eval("input[name=btnK]", el => el.click()))
            // Not working, because of visibility issues
            //.then(() => page.click("input[name=btnK]"));
            .then(() => page.waitForNavigation({ waitUntil: "networkidle2" }))
            // This might have issues for different requests
            // As selector somewhy missing 1-st child always
            // Might be fixed with programmed selector by all .g classes and taking third element
            .then(() => page.$eval("#rso div.g:nth-of-type("+ row +") div div a", el => el.click()))
            // Sites might have issues with self content loading, so networkidle profiles will usually timeout
            // Instead, we are waiting for domcontentloaded and some fixed amout of time for page render
            // .then(() => page.waitForNavigation({ waitUntil: "networkidle2" }))
            .then(() => new Promise( (res) => setTimeout(res, 2000)))
            .then(() => page.screenshot({ path: "./out/google_3rd_ling.png" }));
    })
});
