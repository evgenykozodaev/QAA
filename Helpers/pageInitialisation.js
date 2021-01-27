const puppeteer = require('puppeteer');

const screenResolution = { width: 1920, height: 1080}

exports.pageInitialisation = pageInitialisation

function pageInitialisation() {
    const init = {};
    return puppeteer.launch({
        headless: false,
        slowMo: 100,
        args: [`--window-size=${screenResolution.width},${screenResolution.height}`]
    })
        .then(el => {
            init.browser = el;
            return el.newPage();
        })
        .then(el => {
            init.page = el;
            return el.setViewport(screenResolution);
        })
        .then(() => init);
}


