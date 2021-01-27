const http = require('http');
const helper = require("../Helpers/pageInitialisation")
const google = require("./Google/searching.test")
const engvid = require("./EngVid/login.test")


const mailLogin = "https://mail.ru/?from=login"

//google.searching("Weather in Minsk", 6)
engvid.login('unitSeattle', 'UnitSeattle2020')


describe("Tests for mail.ru", () => {
    beforeAll(() => {
        console.log("Before all")
    });

    afterAll(() => {
        console.log("After all")
        console.log('Response data: ' + data)
    });

    test("Mail Login test", () => {
        return
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

    test("API test", () => {
        return

        return new Promise(resolve => {
            http.get({ path: url }, response => {
                let data = ''
                response.on('data', _data => data += _data)
                response.on('end', () => { resolve(data) })
            })
        })
    })
})