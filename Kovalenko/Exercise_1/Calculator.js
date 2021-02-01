let chai = require('chai');
let should = chai.should();
let expect= chai.expect;
let test = require(".//test_data.json");

class Calculator  {   

    sum(a,b) {
        return(a+b);
    }

    multiplication(a,b) {
        return(a*b);
    }

    division(a,b) {
        return(a/b);
    }

    subtraction(a,b) {
        return(a-b);
    }
    cube(a) {
        return(a*a);
    }

}

let calculator = new Calculator();

function testRun (name, data, f){
    it('test calculator '+name, function (done) {
        let result = f(data.positiv.numberA,data.positiv.numberB);
        result.should.be.eql(data.positiv.result,data.positiv.massage);
        if(name ==="division")
        {
            result = f(data.negative.numberA,data.negative.numberB);
            expect(result,data.negative.massage).to.not.be.finite;
        }
        else {
            result = f(data.negative.numberA,data.negative.numberB);
            result.should.be.not.eql(data.negative.result,data.negative.massage);
        }
        done()
    });
}


describe('Exercise_1', function () {

    testRun ("sum",test.sum,calculator.sum);
    testRun ("multiplication",test.multiplication,calculator.multiplication);
    testRun ("division",test.division,calculator.division);
    testRun ("subtraction",test.subtraction,calculator.subtraction);
    testRun ("cube",test.cube,calculator.cube);

});

