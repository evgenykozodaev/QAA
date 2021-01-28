let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

class Calculator  {

    constructor(a , b) {
        this.a = a;
        this.b = b;
    }

    sumTest1() {
        return(this.a+this.b);
    }

    sumTest2(at,bt) {
        return(at+bt);
    }

}


describe('test_1', function () {
    it(' calculator summ', function (done) {
        let calculator = new Calculator(1 , 2);
        let result1 = calculator.sumTest1();
        result1.should.be.eql(3,"сумма должна равняться 3");
        let result2 = calculator.sumTest2(2,4);
        expect(result2).to.eql(6,"сумма должна равняться 6");
        assert.equal(calculator.sumTest2(4,4),8,"сумма должна равняться 8");
        console.log("Hello world");
        done()
    });
});

