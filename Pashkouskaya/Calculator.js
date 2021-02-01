let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

let list = [
    {
        a:1,
        b:1,
        res:2
    },
    {
        a:2,
        b:2,
        res:4
    },
]

class Calculator  {

    constructor(a , b) {
        this.a = a;
        this.b = b;
    }

    sumTest() {
        return(this.a+this.b);
    }

    multiTest() {
        return(this.a*this.b);
    }

    divisionTest(){
        return(this.a/this.b);
    }
    subtractTest(){
        return(this.a-this.b);
    }
    pow3Test(){
        return(this.a**this.b);
    }

}


describe('test_1', function () {
    it('calculator summ', function (done) {
        let calculator = new Calculator(1,2);
        let result1 = calculator.sumTest();
        result1.should.be.eql(3,"сумма должна равняться 3");
        let result2 = calculator.sumTest(2,4);
        expect(result2).to.not.eql(7);
        done()
    });
});


describe('test_2', function() {
    it('calculator multiplication', function (done) {
        let calculator = new Calculator(2,2);
        let result3 = calculator.multiTest();
        expect(result3).to.eql(4,"произведение должно равняться 4");
        let result4 = calculator.multiTest(2,2);
        expect(result4).to.not.eql(5);
        done()
    });
});

describe('test_3', function() {
    it('calculator division', function (done) {
        let calculator = new Calculator(4,2);
        let result5 = calculator.divisionTest();
        expect(result5).to.eql(2,"частное должно равняться 2");
        let result6 = calculator.divisionTest(4,2);
        expect(result6).to.not.eql(3);
        done()
     });
});   

describe('test_4', function() {
    it('calculator subtraction', function (done) {
        let calculator = new Calculator(4,2);
        let result7 = calculator.subtractTest();
        expect(result7).to.eql(2,"разность должна равняться 2");
        let result8 = calculator.subtractTest(4,2);
        expect(result8).to.not.eql(3);
        done()
    });
});   
    
describe('test_5', function() {
    it('exponentiation calculator', function (done) {
        let calculator = new Calculator(2,3);
        let result9 = calculator.pow3Test();
        expect(result9).to.eql(8,"резльтат должен равняться 8");
        let result10 = calculator.pow3Test(4,2);
        expect(result10).to.not.eql(3);
        done()
    });   
});

describe('test_6', function(){
    for(let i=0; i<list.length; i++)
    {
        it('calculator new sum'+i, function (done) {
            let calculator = new Calculator(list[i].a,list[i].b);
            assert.equal(calculator.sumTest(),list[i].res,"сумма должна равняться");
            done()  
        });
    }
});

describe('test_7', function(){
    for(let i=0; i<list.length; i++)
    {
        it('calculator new multiplication'+i, function (done) {
            let calculator = new Calculator(list[i].a,list[i].b);
            assert.equal(calculator.multiTest(),list[i].res,"произведение должно равняться");
            done()  
        });
    }
});

describe('test_8', function(){
    for(let i=0; i<list.length; i++)
    {
        it('calculator new division'+i, function (done) {
            let calculator = new Calculator(list[i].a,list[i].b);
            assert.equal(calculator.divisionTest(),list[i].res,"частное должно равняться");
            done()  
        });
    }
});

describe('test_9', function(){
    for(let i=0; i<list.length; i++)
    {
        it('calculator new subtraction'+i, function (done) {
            let calculator = new Calculator(list[i].a,list[i].b);
            assert.equal(calculator.subtractTest(),list[i].res,"разность должна равняться");
            done()  
        });
    }
});

describe('test_10', function(){
    for(let i=0; i<list.length; i++)
    {
        it('new exponentiation calculator'+i, function (done) {
            let calculator = new Calculator(list[i].a,list[i].b);
            assert.equal(calculator.pow3Test(),list[i].res,"результат должен равняться");
            done()  
        });
    }
});
