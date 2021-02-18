let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let assert = chai.assert;
chai.use(chaiHttp);
const fs = require('fs');
let urlServer = "https://api.collegefootballdata.com";
let pathLogFile = "Kovalenko\\Exercise_4\\api_test.log";


function addLog( testName, reqBody,resBody) {
let text ="Test: " + testName +"\n" + " request body : \n" +reqBody+"\n"+" response body: \n"+resBody +"\n";

    fs.appendFileSync(pathLogFile, text)
}
/*
для примера использовалась  этаа API
https://any-api.com/collegefootballdata_com/collegefootballdata_com/docs/games/getGames

 */

// текущая дата

describe('example', function () {
    before(function() {
        let date = new Date();
        let textBefore ="Test Run : " + date +"\n";
         fs.appendFileSync(pathLogFile, textBefore, function(){
         fs.writeFileSync(pathLogFile, textBefore)
        });
    });

    after(function() {
        let date = new Date();
        let textAfter ="Test End : " + date +"\n\n\n";
        fs.appendFileSync(pathLogFile, textAfter)
    });

    it('test simple example 1', function (done) {
        this.timeout(5000);
        chai.request(urlServer)
            .get("/games")
            .query({"year":2019,"team":"Connecticut","week":1})
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.not.empty;
                res.body.length.should.be.eql(1);
                res.body.should.have.lengthOf(1);
                res.body[0].should.be.property("season");
                res.body[0].season.should.be.eql(2019);
                let team ="Connecticut";
                team.should.be.oneOf([res.body[0].away_team, res.body[0].home_team]); // неправельно с точки зрения логи проверки теста , но правельно по сути
                assert.include([res.body[0].away_team, res.body[0].home_team], "Connecticut");
                let req ="Url : "+ res.request.url+"\n"+ "Header : " + JSON.stringify(res.request.header)+ "\n" + "Body : "+ "";
                addLog("test1",req ,res.text);
                setTimeout(done, 3000); //чтобы была видна разница  между времением старта и конца  тестов
            });
    });
    it('test simple example 2', function (done) {
        chai.request(urlServer)
            .get("/games")
            .query({"year":2019,"team":"Connecticut"})
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.have.not.empty;
                for (var i=0;i<res.body.length;i++) {
                    res.body[i].should.be.property("season");
                    res.body[i].season.should.be.eql(2019);
                    assert.include([res.body[i].away_team, res.body[i].home_team], "Connecticut");
                }
                let req ="Url : "+ res.request.url+"\n"+ "Header : " + JSON.stringify(res.request.header)+ "\n" + "Body : "+ "";
                addLog("test2",req ,res.text);
                done()
            });
    });
});