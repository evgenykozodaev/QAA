const puppeteer = require('puppeteer');
const url = "https://google.com";
const engVidLoginUrl = "https://www.engvid.com/wp-login.php"
const mailLogin = "https://mail.ru/?from=login"
const row = 6;
/** 
 *  @type {puppeteer.Page}
 */

/**
 *  @type {puppeteer.Browser}
 */

const width = 1920;
const height = 1080;

const pageInitialisation = () => {
    const init = {};
    return puppeteer.launch({
        headless: false,
        slowMo: 100,
        args: [`--window-size=${width},${height}`]
    })
    .then(el => {
        init.browser = el
        return el.newPage();
    })
    .then(el => {
        init.page = el
        return el.setViewport({ width, height});
    })
    .then(() => init)
}

describe("Tests for mail.ru", () => {
    beforeAll(() => {
        console.log("Before all")
    });

    afterAll(() => {
        console.log("After all")
    });


    test("Searching test", () => {
        let page = {}
        let browser = {}
        return pageInitialisation()
            .then(el => {
                page = el.page
                browser = el.browser
            })
            .then(() => page.goto(url, { waitUntil: "networkidle2" }))
            .then(() => page.waitForSelector("form[action='/search'] input[name=q]", { timeout: 2000 }))
            .then(() => page.type('form[action="/search"] input[name=q]', "Погода в Минске"))
            .then(() => page.click('input[name=btnK]'))
            .then(() => page.waitForNavigation({ waitUntil: "networkidle2" }))
            .then(() => page.click('#rso div.g:nth-of-type(' + row + ') div div a'))
            .then(() => new Promise((res) => setTimeout(res, 2000)))
            .then(() => page.screenshot({ path: "./out/google_3rd_ling.png" }))
            .then(() => browser.close())
    })

    test('Raw equal mail.ru', () => {
        expect(url).toBe(url);
    })

    test("EngVid Login test", () => {
        let page = {}
        let browser = {}
        return pageInitialisation()
            .then(el => {
                page = el.page
                browser = el.browser
                return el
            })
            .then(() => page.goto(engVidLoginUrl, { waitUntil: "networkidle2" }))
            .then(() => page.waitForSelector('#user_login', { timeout: 2000 }))
            .then(() => page.type('#user_login', 'zuzic'))
            .then(() => page.waitForSelector('#user_pass', { timeout: 2000 }))
            .then(() => page.type('#user_pass', 'ZenkoYury19890609'))
            .then(() => page.click('#wp-submit'))
            .then(() => new Promise((res) => setTimeout(res, 2000)))
            .then(() => page.screenshot({ path: "./out/google_3rd_ling.png" }))
            .then(() => browser.close())
    })

    test("Mail Login test", () => {
        let page = {}
        let browser = {}
        let loginPath = "input[name='login']"
        let passwordPath = "input[name='password']"
        let loginButtonPath = "button[class='button svelte-no02r']"
        let passwordButtonPath = "button[class='second-button svelte-no02r']"

        return pageInitialisation().then(el => {
                page = el.page
                browser = el.browser
                return el
            })
            .then(() => page.goto(mailLogin, { waitUntil: "networkidle2" }))
            .then(() => page.waitForSelector(loginPath, { timeout: 2000 }))
            .then(() => page.type(loginPath, 'testautamationmail'))
            .then(() => page.click(loginButtonPath))
            .then(() => page.waitForSelector(passwordPath, { timeout: 2000 }))
            .then(() => page.type(passwordPath, 'Ser!2345'))
            .then(() => page.click(passwordButtonPath))
            .then(() => page.waitForNavigation({ waitUntil: "networkidle2" }))
            .then(() => new Promise((res) => setTimeout(res, 2000)))
            .then(() => browser.close())
    })
});