let chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let urlServer = "http://172.31.33.56";
const fs = require('fs');
let pathLogFile = "./Trusevich/Exercize_4/test.log";
let pathLogFileJSON = "./Trusevich/Exercize_4/testJSON.json";

const params = [
    {
        siteId: "151",
        cartNumber: "4111111111111111",
    },
    {
        siteId: "130",
        cartNumber: "4242424242424242",
    },
];

let randomNumber = generateRandomNumber(10000, 99999999);
let testLog = {};
let transactionId;

function writeTestResultToLogs(testName, requestBody, responseBody, testResult) {
    let testResultToLog =
    {
        TestName: testName,
        RequestBody: requestBody,
        ResponseBody: responseBody,
        TestResult: testResult,
    };
    return testResultToLog
}

function addLog(testName, reqBody, resBody, testResult) {
    let text = "\nTest Name: " + testName + "\n" + "Request Body: \n" + reqBody + ",\n" + "ResponseBody: \n" + resBody + ",\n" + "Test Result: " + testResult + "\n";

    fs.appendFileSync(pathLogFile, text)
}

function generateRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var random_string = '';
    for (var i = 0; i < length; i++) {
        random_string += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return random_string
}

function generateRandomNumber(min, max) {
    return String(Math.floor((Math.random() * (max - min + 1)) + min));
}

function writePayRequestBody(randomNumber, cartNumber) {
    let payRequestData = {
        "Amount": "5",
        "Currency": "RUB",
        "ExtraData": {
            "Custom": "field",
            "Key": "value"
        },
        "CustomerInfo": {
            "Address": "street",
            "Country": "BLR",
            "Email": "ilya@ff.ru",
            "Phone": "+1234567567890",
            "Town": "minsk",
            "ZIP": "225700",
            "Language": "BY",
            "IP": "135.20.34.46"
        },
        "PaymentMethod": "Card",
        "Description": "test5555555555555",
        "OrderId": randomNumber,
        "PaymentDetails": {
            "CardholderName": "test test",
            "CardNumber": cartNumber,
            "CVC": "711",
            "ExpMonth": "06",
            "ExpYear": "22"
        },
        "RebillFlag": true
    }
    return payRequestData;
}

function writeBlockRequestBody(randomNumber) {
    let blockRequestData = {
        "Amount": "5",
        "Currency": "RUB",
        "ExtraData": {
            "Custom": "field",
            "Key": "value"
        },
        "CustomerInfo": {
            "Address": "street",
            "Country": "BYA",
            "Email": "ilya@ff.ru",
            "Phone": "+375243454666",
            "Town": "minsk",
            "ZIP": "222410",
            "Language": "BY",
            "IP": "1.2.3.111"
        },
        "PaymentMethod": "Card",
        "Description": "ilya",
        "OrderId": randomNumber + '1',
        "PaymentDetails": {
            "CardholderName": "ilya vvv",
            "CardNumber": '4111111111111111',
            "CVC": "723",
            "ExpMonth": "06",
            "ExpYear": "22"
        },
        "RebillFlag": true
    };
    return blockRequestData;
}

function writeChargeRequestBody(randomNumber, transactionId) {
    let chargeRequestData = {
        "OrderId": randomNumber,
        "Amount": "5",
        "Currency": "RUB",
        "Description": "Description",
        "TransactionId": transactionId,
    };
    return chargeRequestData;
}

describe('API Test', function () {

    before(function () {
        let date = new Date();
        let textBefore = "\n\nTest Run: " + date + "\n";
        fs.appendFileSync(pathLogFile, textBefore);

        testLog.StartDate = date;
        testLog.tests = [];
    });

    after(function () {
        let date = new Date();
        let textAfter = "Test End: " + date + "\n";
        testLog.EndDate = date;

        fs.appendFileSync(pathLogFile, textAfter)
        // JSON.stringify docs: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        fs.appendFileSync(pathLogFileJSON, JSON.stringify(testLog, null, 2))
    });

    it('Check Balance', function (done) {
        chai.request(urlServer)
            .get('/balance')
            .set('X-SITE-ID', "151")
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', 'test')
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).not.to.be.empty;
                expect(res.body).to.have.property('TransactionState').equal('success');
                expect(res.body).to.have.property('Currency').equal('RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : -";
                addLog("Check Balance", req, res.text, "Success");
                testLog.tests.push(writeTestResultToLogs("Check Balance", res.request.header, res.body, "Success"));
                done();
            })
            .catch(function (error) {
                testLog.tests.push(writeTestResultToLogs("Check Balance", "", "", error.message));

                addLog("Check Balance", "", "", error.message);
                done(error);
            })
    })

    params.forEach(function (param, index) {
        it('Pay_CheckStatus', function (done) {
            chai.request(urlServer)
                .post('/payments/requests/single')
                .set('X-SITE-ID', param.siteId)
                .set('X-REQUEST-ID', generateRandomString(9) + "_test")
                .set('X-REQUEST-SIGNATURE', 'test')
                .send(writePayRequestBody(randomNumber, param.cartNumber))
                .then(function (res) {
                    transactionId = res.body.TransactionId;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('TransactionId');
                    res.body.should.have.property('OrderId', randomNumber);
                    res.body.should.have.property('Amount', '5.00');
                    res.body.should.have.property('Currency', 'RUB');
                    let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(writePayRequestBody(randomNumber, param.cartNumber));
                    addLog(`Pay № ${index + 1}`, req, res.text, "Success");
                    testLog.tests.push(writeTestResultToLogs(`Pay № ${index + 1}`, writePayRequestBody(randomNumber, param.cartNumber), res.body, "Success"));

                    chai.request(urlServer)
                        .get(`/transactions/${transactionId}`)
                        .set('X-SITE-ID', param.siteId)
                        .set('X-REQUEST-ID', generateRandomString(9) + "_test")
                        .set('X-REQUEST-SIGNATURE', '')
                        .then(function (res) {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : -";
                            addLog(`CheckStatus № ${index + 1}`, req, res.text, "Success");
                            testLog.tests.push(writeTestResultToLogs(`CheckStatus № ${index + 1}`, res.request.header, res.body, "Success"));
                            done();
                        })
                        .catch(function (error) {
                            testLog.tests.push(writeTestResultToLogs(`CheckStatus № ${index + 1}`, "", "", error.message));
                            addLog("CheckStatus", "", "", error.message);
                            done(error)
                        })

                })
                .catch(function (error) {
                    testLog.tests.push(writeTestResultToLogs(`Pay № ${index + 1}`, "", "", error.message));
                    addLog("Pay", "", "", error.message);
                    done(error)
                });
        })
    })

    it('Block', function (done) {
        chai.request(urlServer)
            .post('/payments/requests/block')
            .set('X-SITE-ID', '151')
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', 'test')
            .send(writeBlockRequestBody(randomNumber))
            .then(function (res) {
                transactionId = res.body.TransactionId;

                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('TransactionId');
                res.body.should.have.property('OrderId', randomNumber + "1");
                res.body.should.have.property('Amount', '5.00');
                res.body.should.have.property('Currency', 'RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(writeBlockRequestBody(randomNumber));
                addLog("Block", req, res.text, "Success");
                testLog.tests.push(writeTestResultToLogs("Block", writeBlockRequestBody(randomNumber), res.body, "Success"));
                setTimeout(function () { done() }, 500);
            })
            .catch(function (error) {
                testLog.tests.push(writeTestResultToLogs("Block", "", "", error.message));
                addLog("Block", "", "", error.message);
                done(error);
            });
    });


    it('Charge', function (done) {
        chai.request(urlServer)
            .post('/payments/charge')
            .set('X-SITE-ID', '151')
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', '')
            .send(writeChargeRequestBody(randomNumber, transactionId))
            .then(function (res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('TransactionId', transactionId);
                res.body.should.have.property('OrderId', randomNumber + '1');
                res.body.should.have.property('Amount', '5.00');
                res.body.should.have.property('Currency', 'RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(writeChargeRequestBody(randomNumber, transactionId));
                addLog("Charge", req, res.text, "Success");
                testLog.tests.push(writeTestResultToLogs("Charge", writeChargeRequestBody(randomNumber, transactionId), res.body, "Success"));
                done();
            })
            .catch(function (error) {
                testLog.tests.push(writeTestResultToLogs("Charge", "", "", error.message));
                addLog("Charge", "", "", error.message);
                done(error);
            })
    })
})
