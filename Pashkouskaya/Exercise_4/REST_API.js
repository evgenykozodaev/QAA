//Метод require() используется для загрузки и кэширования модулей JavaScript.
const { assert } = require("chai"); 
const chai = require("chai"); //подключение chai
const chaiHttp = require("chai-http"); //для тестирования http
const path = require("path"); //для работы с файлами
const fs = require("fs"); //работа с файлами
const MongoClient = require('mongodb').MongoClient;

chai.use(chaiHttp);

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'testdb';

const HOST = "https://jsonplaceholder.typicode.com";
const LOG_NAME = path.join("Pashkouskaya", "Exercise_4", "api_test.log");
const JSON_LOG_NAME = path.join("Pashkouskaya", "Exercise_4", "api_test.log.json");

const client = new MongoClient(MONGO_URL);
/**
 * @type {import("mongodb").Collection}
 */
let logsCollection = null;

let runs = []; //сюда загружаются все "раны"

function getCurrentRun() { // получение текущего запуска
    return runs[runs.length - 1];
}

function reqToStr(req, ident) { //преобразование объекта в строку
    return `Url: ${req.url}
${ident}Header: ${JSON.stringify(req.header)}
${ident}Body: ${JSON.stringify(req.body)}`;
}

function resToStr(res, ident) { //преобразование объекта в строку
    return `Status: ${res.status}
${ident}Header: ${JSON.stringify(res.header)}
${ident}Body: ${JSON.stringify(res.body)}`
}

function addLog(record) {
    return new Promise((resolve, reject) => {
        addTextLog(record);
        addJSONLog(record)
            .then(resolve, reject);
    });
    
}

function addTextLog({testName, req, res, t_status}) {
    const text = `\t${testName}
\t\trequest body : 
\t\t\t${reqToStr(req, "\t\t\t")}
\t\tresponse body :
\t\t\t${resToStr(res, "\t\t\t")}
\t\ttest: ${t_status ? "ok" : "fail"}
`;

    fs.appendFileSync(LOG_NAME, text); // запись текста в файл
}

function addJSONLog({testName, req, res, t_status, start, end}) {
    const currentRun = getCurrentRun();
    const record = { //добавление теста в "ран"
        RequestBody: {
            method: req.method,
            url: req.url,
            payload: req.payload,
            headers: req.headers,
        },
        ResponseBody: {
            status: res.status,
            body: res.body,
            headers: res.headers,
        },
        TestName: testName,
        TestResult: t_status ? "ok" : "fail",
        Start: start,
        End: end,
        RunId: currentRun.Id,
    };

    currentRun.Tests.push(record);
    return logsCollection.insertOne(record);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function initFileLogging() {
    const date = new Date();
    let textBefore ="Test Run " + date + " (" + date.getTime() + ")" +"\n";
    fs.appendFileSync(LOG_NAME, textBefore);

    if (!fs.existsSync(JSON_LOG_NAME)) {
        fs.writeFileSync(JSON_LOG_NAME, "[]");
    }

    runs = JSON.parse(fs.readFileSync(JSON_LOG_NAME).toString());
    const runId = getRandomInt(10000) + 1;
    runs.push({
        Id: runId,
        StartDate: date,
        Tests: [],
    });
}

function endFileLogging() {
    const date = new Date();
    let text ="Test End " + date + " (" + date.getTime() + ")" +"\n\n\n";
    fs.appendFileSync(LOG_NAME, text);

    fs.writeFileSync(JSON_LOG_NAME, JSON.stringify(runs, null, 4));
}


before(function(done) {
    client.connect(function(err) {
        if (err) {
            done(err);
            return;
        }

        logsCollection = client.db(DB_NAME).collection("logs");

        initFileLogging();

        console.log("RunId: ", getCurrentRun().Id);

        done();
    });
});

after(function() {
    endFileLogging();
    client.close();
});

describe("get users", function () {
    let users = [];

    it("list", function (done) {
        const start = Date.now();
        chai.request(HOST)
            .get("/users")
            .end((err, res) => {
                assert.equal(res.status, 200);

                assert.notExists(err);
                assert.isArray(res.body);
                for (const u of res.body) {
                    assert.isObject(u);
                    assert.isNumber(u.id);
                    assert.isString(u.name);
                    assert.isString(u.email);
                    assert.isObject(u.address);
                    assert.isString(u.phone);
                    assert.isObject(u.company);
                    users.push(u);
                }

                addLog({ 
                    testName: "list", 
                    req: res.request, 
                    res: res, 
                    t_status: true,
                    start: start,
                    end: Date.now(),
                })
                    .then(() => done(), done);
            });
    });

    it("by ids from list", function (done) {
        this.timeout(5000);
        const promises = [];
        for (const u of users) {
            const p = new Promise((resolve, reject) => {
                const start = Date.now();
                chai.request(HOST)
                    .get("/users/" + u.id)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                        }

                        assert.notExists(err);

                        assert.equal(res.status, 200);
                        
                        const ru = res.body;
                        assert.equal(ru.id, u.id);
                        assert.equal(ru.name, u.name);
                        assert.equal(ru.email, u.email);
                        assert.deepEqual(ru.address, u.address);
                        assert.equal(ru.phone, u.phone);
                        assert.deepEqual(ru.company, u.company);

                        addLog({ 
                            testName: "by id " + u.id, 
                            req: res.request, 
                            res: res, 
                            t_status: true,
                            start: start,
                            end: Date.now(),
                        })
                            .then(resolve, reject);
                    });
            });
            promises.push(p);
        }

        Promise.all(promises).then(() => done(), done);
    });
});

describe("create post", function () {
    const n = getRandomInt(15) + 1;
    console.log("Running: ", n);
    for (let i = 0; i < n; i++) {
        it("post for user " + i, function (done) {
            const start = Date.now();
            chai.request(HOST)
                .post("/posts")
                .set('Content-type', 'application/json; charset=UTF-8')
                .send({
                    title: 'Test' + i,
                    body: 'Some long post body' + i,
                    userId: 1,
                })
                .end((err, res) => {
                    try {
                        assert.notExists(err);
                    
                        assert.equal(res.status, 201)
    
                        const post = res.body;

                        // console.log(post)
                        
                        assert.isString(post.title);
                        assert.isString(post.body);
                        assert.isNumber(post.id);
                        assert.equal(post.userId, 1);

                        addLog({ 
                            testName: "post " + i,
                            req: res.request, 
                            res: res, 
                            t_status: true,
                            start: start,
                            end: Date.now(),
                        })
                            .then(() => done(), done);
                    } catch (terr) {
                        done(terr);
                    }
                });
        });
    }
});