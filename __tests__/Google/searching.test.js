const helper = require("../../Helpers/pageInitialisation");
const url = "https://google.com";
const searchPath = 'form[action="/search"] input[name=q]'
const searchButtonPath = 'input[name=btnK]'


function searching(text, row) {
    describe("Google searching", () => {
        test("Open " + row, () => {
            let page = {}
            let browser = {}
            const rowPath = '#rso div.g:nth-of-type(' + row + ') div div a'
            return helper.pageInitialisation()
                .then(el => {
                    page = el.page
                    browser = el.browser
                })
                .then(() => page.goto(url, { waitUntil: "networkidle2" }))
                .then(() => page.waitForSelector(searchPath, { timeout: 2000 }))
                .then(() => page.type(searchPath, text))
                .then(() => page.click(searchButtonPath))
                .then(() => page.waitForNavigation({ waitUntil: "networkidle2" }))
                .then(() => page.click(rowPath))
                .then(() => new Promise((res) => setTimeout(res, 2000)))
                .then(() => browser.close())
        })
    })
}

exports.searching = searching;
