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
]

function addLog(testName, reqBody, resBody, testResult) {
    let text = "\nTest Name: " + testName + "\n" + "Request Body: \n" + reqBody + ",\n" + "ResponseBody: \n" + resBody + ",\n" + "Test Result: " + testResult + "\n";

    fs.appendFileSync(pathLogFile, text)
}

function generateRandomString(string_length) {
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for (let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

function generateRandomNumber(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

describe('API Test', function () {
    let testLog = {};

    before(function () {
        let date = new Date();
        let textBefore = "Test Run" + date + "\n";
        fs.writeFileSync(pathLogFile, textBefore);

        testLog.StartDate = date;
        testLog.tests = [];
    });

    after(function () {
        let date = new Date();
        let textAfter = "Test End:" + date;
        testLog.EndDate = date

        fs.appendFileSync(pathLogFile, textAfter)
        fs.writeFileSync(pathLogFileJSON, JSON.stringify(testLog))
    });

    let randomNumber = String(generateRandomNumber(10000, 99999999));

    it('Check Balance', function (done) {
        chai.request(urlServer)
            .get('/balance')
            .set('X-SITE-ID', "151")
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', 'test')
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).not.to.be.empty;
                expect(res.body).to.have.property('TransactionState').equal('success');
                expect(res.body).to.have.property('Currency').equal('RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body :" + "-";
                addLog("Check Balance", req, res.text, "Success");

                testLog.tests.push({
                    TestName: "Check Balance",
                    RequestBody: '',
                    ResponseBody: res.text,
                    TestResult: 'Success',
                })
                done();
            })
            .catch(function (error) {
                testLog.tests.push({
                    TestName: "Check Balance",
                    RequestBody: '',
                    ResponseBody: '',
                    TestResult: error.message,
                });

                addLog("Check Balance", "", "", error.message);

                done(error)
            })
    })



    params.forEach(function (param, index) {
        let transactionId;

        it('Pay_CheckStatus', function (done) {
            let data = {
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
                    "CardNumber": param.cartNumber,
                    "CVC": "711",
                    "ExpMonth": "06",
                    "ExpYear": "22"
                },
                "RebillFlag": true
            };

            chai.request(urlServer)
                .post('/payments/requests/single')
                .set('X-SITE-ID', param.siteId)
                .set('X-REQUEST-ID', generateRandomString(9) + "_test")
                .set('X-REQUEST-SIGNATURE', 'test')
                .send(data)
                .then(function (res) {
                    transactionId = res.body.TransactionId;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('TransactionId');
                    res.body.should.have.property('OrderId', randomNumber);
                    res.body.should.have.property('Amount', '5.00');
                    res.body.should.have.property('Currency', 'RUB');
                    let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(data);
                    addLog(`Pay № ${index + 1}`, req, res.text, "Success");
                    testLog.tests.push({
                        TestName: `Pay № ${index + 1}`,
                        RequestBody: data,
                        ResponseBody: res.text,
                        TestResult: 'Success',
                    })

                    chai.request(urlServer)
                        .get(`/transactions/${transactionId}`)
                        .set('X-SITE-ID', param.siteId)
                        .set('X-REQUEST-ID', generateRandomString(9) + "_test")
                        .set('X-REQUEST-SIGNATURE', '')
                        .then(function (res) {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(data);
                            addLog(`CheckStatus № ${index + 1}`, req, res.text, "Success");
                            testLog.tests.push({
                                TestName: `CheckStatus № ${index + 1}`,
                                RequestBody: data,
                                ResponseBody: res.text,
                                TestResult: 'Success',
                            })
                            done();
                        })
                        .catch(function (error) {
                            testLog.tests.push({
                                TestName: `CheckStatus № ${index + 1}`,
                                RequestBody: '',
                                ResponseBody: '',
                                TestResult: error.message,
                            });
                            addLog("CheckStatus", "", "", error.message);

                            done(error)
                        })

                })
                .catch(function (error) {
                    testLog.tests.push({
                        TestName: `Pay № ${index + 1}`,
                        RequestBody: '',
                        ResponseBody: '',
                        TestResult: error.message,
                    });
                    addLog("Pay", "", "", error.message);

                    done(error)
                });
        })
    })


    let transactionId;

    it('Block', function (done) {
        let data = {
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

        chai.request(urlServer)
            .post('/payments/requests/block')
            .set('X-SITE-ID', '151')
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', 'test')
            .send(data)
            .then(function (res) {
                transactionId = res.body.TransactionId;

                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('TransactionId');
                res.body.should.have.property('OrderId', randomNumber + "1");
                res.body.should.have.property('Amount', '5.00');
                res.body.should.have.property('Currency', 'RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(data);
                addLog(`Block`, req, res.text, "Success");

                testLog.tests.push({
                    TestName: "Block",
                    RequestBody: data,
                    ResponseBody: res.text,
                    TestResult: 'Success',
                })

                setTimeout(function () { done() }, 500);
            })
            .catch(function (error) {
                testLog.tests.push({
                    TestName: "Block",
                    RequestBody: '',
                    ResponseBody: '',
                    TestResult: error.message,
                });
                addLog("Block", "", "", error.message);

                done(error)
            });
    });


    it('Charge', function (done) {
        let data = {
            "OrderId": randomNumber,
            "Amount": "5",
            "Currency": "RUB",
            "Description": "Description",
            "TransactionId": transactionId,
        };
        chai.request(urlServer)
            .post('/payments/charge')
            .set('X-SITE-ID', '151')
            .set('X-REQUEST-ID', generateRandomString(9) + "_test")
            .set('X-REQUEST-SIGNATURE', '')
            .send(data)
            .then(function (res) {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('TransactionId', transactionId);
                res.body.should.have.property('OrderId', randomNumber + '1');
                res.body.should.have.property('Amount', '5.00');
                res.body.should.have.property('Currency', 'RUB');
                let req = "Url : " + res.request.url + "\n" + "Header : " + JSON.stringify(res.request.header) + "\n" + "Body : " + JSON.stringify(data);
                addLog(`Charge`, req, res.text);

                testLog.tests.push({
                    TestName: "Charge",
                    RequestBody: data,
                    ResponseBody: res.text,
                    TestResult: 'Success',
                })
                done();
            })
            .catch(function (error) {
                testLog.tests.push({
                    TestName: "Charge",
                    RequestBody: '',
                    ResponseBody: '',
                    TestResult: error.message,
                });
                addLog("Charge", "", "", error.message);

                done(error)
            })
    })
})