let chai = require('chai');
let should = chai.should();
let expect= chai.expect;
let test = require("../task_1/test_data.json")

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


describe('test_1', function () {
    let calculator = new Calculator()
    it('test calculator sum', function (done) {        
        let result = calculator.sum(test.sum.positiv.numberA,test.sum.positiv.numberB);
        result.should.be.eql(test.sum.positiv.result,test.sum.positiv.massage); 
        result = calculator.sum(test.sum.negative.numberA,test.sum.negative.numberB);
        result.should.be.not.eql(test.sum.negative.result,test.sum.negative.massage); 
        done()
    });

    it('test calculator multiplication', function (done) {        
        let result = calculator.multiplication(test.multiplication.positiv.numberA,test.multiplication.positiv.numberB);
        result.should.be.eql(test.multiplication.positiv.result,test.multiplication.positiv.massage); 
        result = calculator.multiplication(test.multiplication.negative.numberA,test.multiplication.negative.numberB);
        result.should.be.not.eql(test.multiplication.negative.result,test.multiplication.negative.massage); 
        done()
    });

    it('test calculator division', function (done) {        
        let result = calculator.division(test.division.positiv.numberA,test.division.positiv.numberB);
        result.should.be.eql(test.division.positiv.result,test.division.positiv.massage); 
        result = calculator.division(test.division.negative.numberA,test.division.negative.numberB);
        expect(result,test.division.negative.massage).to.not.be.finite;
        done()
    });

    it('test calculator subtraction', function (done) {        
        let result = calculator.subtraction(test.subtraction.positiv.numberA,test.subtraction.positiv.numberB);
        result.should.be.eql(test.subtraction.positiv.result,test.subtraction.positiv.massage); 
        result = calculator.subtraction(test.subtraction.negative.numberA,test.subtraction.negative.numberB);
        result.should.be.not.eql(test.subtraction.negative.result,test.subtraction.negative.massage); 
        done()
    });

    it('test calculator cube', function (done) {        
        let result = calculator.cube(test.cube.positiv.numberA,test.cube.positiv.numberB);
        result.should.be.eql(test.cube.positiv.result,test.cube.positiv.massage); 
        result = calculator.cube(test.cube.negative.numberA,test.cube.negative.numberB);
        result.should.be.not.eql(test.cube.negative.result,test.cube.negative.massage); 
        done()
    });
    
});

