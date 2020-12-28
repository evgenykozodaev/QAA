const helper = require("../../Helpers/pageInitialisation");
const engVidLoginUrl = "https://www.engvid.com/wp-login.php"

const loginInputPath = '#user_login'
const passwordInputPath = '#user_pass'
const submitButtonPath = '#wp-submit'

function login(login, password) {
    describe("EngVid", () => {
        test("EngVid login", () => {
            let page = {}
            let browser = {}
            return helper.pageInitialisation()
                .then(el => {
                    page = el.page
                    browser = el.browser
                })
                .then(() => page.goto(engVidLoginUrl, { waitUntil: "networkidle2" }))
                .then(() => page.waitForSelector(loginInputPath, { timeout: 2000 }))
                .then(() => page.type(loginInputPath, login))
                .then(() => page.waitForSelector(passwordInputPath, { timeout: 2000 }))
                .then(() => page.type(passwordInputPath, password))
                .then(() => page.click(submitButtonPath))
                .then(() => new Promise((res) => setTimeout(res, 2000)))
                .then(() => browser.close())
        })
    })
}

exports.login = login;