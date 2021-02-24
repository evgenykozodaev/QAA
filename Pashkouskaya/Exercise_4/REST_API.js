//Метод require() используется для загрузки и кэширования модулей JavaScript.
const { assert } = require("chai"); //подключение библиотеки, работающей в браузере
const chai = require("chai"); //подключение chai
const chaiHttp = require("chai-http"); //для тестирования http
const path = require("path"); //для работы с файлами
const fs = require("fs"); //работа с файлами

chai.use(chaiHttp);

const HOST = "https://jsonplaceholder.typicode.com";
const LOG_NAME = path.join("Pashkouskaya", "Exercise_4", "api_test.log");
const JSON_LOG_NAME = path.join("Pashkouskaya", "Exercise_4", "api_test.log.json");

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

function addLog(testName, req, res, t_status) {
    const text = `\t${testName}
\t\trequest body : 
\t\t\t${reqToStr(req, "\t\t\t")}
\t\tresponse body :
\t\t\t${resToStr(res, "\t\t\t")}
\t\ttest: ${t_status ? "ok" : "fail"}
`;

    fs.appendFileSync(LOG_NAME, text); // запись текста в файл

    getCurrentRun().Tests.push({ //добавление теста в "ран"
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
    });
}

before(function() {
    const date = new Date();
    let textBefore ="Test Run " + date + " (" + date.getTime() + ")" +"\n";
    fs.appendFileSync(LOG_NAME, textBefore);

    if (!fs.existsSync(JSON_LOG_NAME)) {
        fs.writeFileSync(JSON_LOG_NAME, "[]");
    }

    runs = JSON.parse(fs.readFileSync(JSON_LOG_NAME).toString());
    runs.push({
        StartDate: date,
        Tests: [],
    });
});

after(function() {
    const date = new Date();
    let text ="Test End " + date + " (" + date.getTime() + ")" +"\n\n\n";
    fs.appendFileSync(LOG_NAME, text);

    fs.writeFileSync(JSON_LOG_NAME, JSON.stringify(runs, null, 4));
});

describe("get users", function () {
    let users = [];

    it("list", function (done) {
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

                addLog("list", res.request, res, true);
                done();
            });
    });

    it("by ids from list", function (done) {
        this.timeout(5000);
        const promises = [];
        for (const u of users) {
            const p = new Promise((resolve, reject) => {
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

                        addLog("by id " + u.id, res.request, res, true);
                        resolve();
                    });
            });
            promises.push(p);
        }

        Promise.all(promises).then(() => done(), done);
    });
});