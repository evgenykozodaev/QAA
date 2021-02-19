let chai = require('chai');
let expect = chai.expect;
let assert = chai.assert;

let list = [
    { a: 3, b: 3 },
    { a: 2, b: 1 },
    { a: -6, b: 8 },
    { a: 3, b: -2 },
    { a: 7, b: 10 }
]

class Calculator  {

    sumTest(a, b) {
        return(a + b);
    }

    multiTest(a, b) {
        return(a * b);
    }

    divisionTest(a, b){
        if (b!== 0) {
            return (a / b);
        } else {
            //https://learn.javascript.ru/try-catch
            throw new Error("You cannot divide a number by zero");
        }
    }
    
    subtractTest(a, b){
        return(a - b);
    }

    pow3Test(a){
        return(a ** 3);
    }

}
//https://overreacted.io/on-let-vs-const/
const comp = new Calculator();

describe('test_1 (Checking the sum of numbers)', function () {
    it('Sum of given numbers', function () {
        //https://www.chaijs.com/api/assert/#method_typeof
        assert.typeOf(comp.sumTest(25, 1), "number", "The result is a number");
        //https://www.chaijs.com/api/assert/#method_equal
        assert.equal(comp.sumTest(0, -4), -4, "The result is a -4");
        assert.equal(comp.sumTest(0, 0), 0, "The result is a 0");
        assert.equal(comp.sumTest(12, 2), 14, "The result is a 14");

        for(let i=0; i<list.length; i++)
    {
            const result = list[i].a + list[i].b;
            assert.equal(comp.sumTest(list[i].a, list[i].b), result, `The result is a ${result}`);
    }
    });
});


describe('test_2 (Checking the multiplication of given numbers)', function() {
    it('Multiplication of given numbers', function () {
        assert.typeOf(comp.multiTest(25, 1), "number", "The result is a number");
        assert.equal(comp.multiTest(2, -4), -8, "The result is a -8");
        assert.equal(comp.multiTest(0, 0), 0, "The result is a 0");
        assert.equal(comp.multiTest(-2, -2), 4, "The result is a 4");

        for(let i=0; i<list.length; i++)
    {
            const result = list[i].a * list[i].b;
            assert.equal(comp.multiTest(list[i].a, list[i].b), result, `The result is a ${result}`);
    }
    });
});

describe('test_3 (Checking the division of given numbers)', function() {
    it('Division of given numbers', function () {
        expect(() => comp.divisionTest(4, 0)).throw("You cannot divide a number by zero");
        //https://www.chaijs.com/api/bdd/
        expect(comp.divisionTest(10, -2)).to.equal(-5, "The division result is -5");
        expect(comp.divisionTest(-8, -4)).to.equal(2, "The division result is 2");
        expect(comp.divisionTest(20, 5)).to.equal(4, "The division result is 4");

        for(let i=0; i<list.length; i++)
    {
            const result = list[i].a / list[i].b;
            expect(comp.divisionTest(list[i].a, list[i].b)).to.equal(result, `The result is a ${result}`);
    }
    }); 
});   

describe('test_4(Checking the difference between given numbers)', function() {
    it('Difference between given numbers', function () {
        //https://www.chaijs.com/api/bdd/
        comp.subtractTest(-5, -3).should.not.equal(2, "Result is not equal 2");
        comp.subtractTest(-20, 30).should.equal(-50, "The result is a -50");
        comp.subtractTest(12, 11).should.equal(1, "The result is a 1");
        comp.subtractTest(13, 13).should.equal(0, "The result is a 0");

        for (let i = 0; i < list.length; i++) {
            const result = list[i].a - list[i].b;
            comp.subtractTest(list[i].a, list[i].b).should.equal(result, `The result is a ${result}`);
    }
  });
});   
    
describe('test_5 (Exponentiation check)', function() {
    it('Exponentiation check', function () {
        assert.typeOf(comp.pow3Test(25), "number", "The result is a number");
        assert.equal(comp.pow3Test(2), 8, "The result is a 8");
        assert.equal(comp.pow3Test(0), 0, "The result is a 0");
        assert.equal(comp.pow3Test(-2), -8, "The result is a -8");

        for(let i=0; i<list.length; i++)
    {
            const result = list[i].a ** 3;
            assert.equal(comp.pow3Test(list[i].a), result, `The result is a ${result}`);
    }
    });
});
