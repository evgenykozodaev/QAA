let chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;


class Calculator {
  constructor() { }

  sum(a, b) {
    return (a + b);
  }

  difference(a, b) {
    return (a - b);
  }

  multiplication(a, b) {
    return (a * b);
  }

  division(a, b) {
    if (b !== 0) {
      return (a / b);
    }
    else {
      return ("Division on \"0\" isn't allowed");
    }
  }

  exponentiation(a) {
    return (a ** 3);
  }
}

let listOfTestNumbers = [
  { a: 1, b: 1 },
  { a: 2, b: 4 },
  { a: 5, b: -3 },
  { a: 5, b: 5 },
  { a: 1, b: 0 },
  { a: -1, b: 45 },
  { a: 8, b: 10 },
];

const calc = new Calculator();

describe("Sum", function () {
  it("Sum of two numbers", function () {
    assert.typeOf(calc.sum(11, 4), "number", "Sum result is number");
    assert.lengthOf(String(calc.sum(11, 4)), 2, "Length should be 2");
    assert.equal(calc.sum(4, -4), 0, "Sum result should be 0");
    assert.equal(calc.sum(4, 10), 14, "Sum result should be 14");
    assert.equal(calc.sum(-8, 5), -3, "Sum result should be -3");

    for (let i = 0; i < listOfTestNumbers.length; i++) {
      const result = listOfTestNumbers[i].a + listOfTestNumbers[i].b;
      assert.equal(calc.sum(listOfTestNumbers[i].a, listOfTestNumbers[i].b), result, `Sum result should be ${result}`);
    }
  });
});

describe("Difference", function () {
  it("Difference of two numbers", function () {
    calc.difference(0, 10).should.equal(-10, "Difference result should be -10");
    calc.difference(7, 5).should.equal(2, "Difference result should be 2");
    calc.difference(-7, 5).should.equal(-12, "Difference result should be -12");
    calc.difference(5, 10).should.not.equal(5, "Difference result shouldn't be 5");

    for (let i = 0; i < listOfTestNumbers.length; i++) {
      const result = listOfTestNumbers[i].a - listOfTestNumbers[i].b;
      calc.difference(listOfTestNumbers[i].a, listOfTestNumbers[i].b).should.equal(result, `Difference result should be ${result}`);
    }
  });
});

describe("Multiplication", function () {
  it("Multiplication of two numbers", function () {
    expect(calc.multiplication(4, 9)).to.equal(36, "Multiplication result should be 36");
    expect(calc.multiplication(8, 0)).to.equal(0, "Multiplication result should be 0");
    expect(calc.multiplication(-8, 2)).to.equal(-16, "Multiplication result should be -16");

    for (let i = 0; i < listOfTestNumbers.length; i++) {
      const result = listOfTestNumbers[i].a * listOfTestNumbers[i].b;
      expect(calc.multiplication(listOfTestNumbers[i].a, listOfTestNumbers[i].b)).to.equal(result, `Multiplication result should be ${result}`);
    }
  });
});

describe("Division", function () {
  it("Division of two numbers", function () {
    assert.equal(calc.division(10, 2), 5, "Division result should be 5");
    assert.equal(calc.division(-4, 4), -1, "Division result should be -1");
    assert.equal(calc.division(4, -4), -1, "Division result should be -1");
    assert.equal(calc.division(8, 0), "Division on \"0\" isn't allowed", "Division on \"0\" should led to the error");

    for (let i = 0; i < listOfTestNumbers.length; i++) {
      let result;

      if (listOfTestNumbers[i].b === 0) {
        result = "Division on \"0\" isn't allowed";
      } else {
        result = listOfTestNumbers[i].a / listOfTestNumbers[i].b;
      }

      assert.equal(calc.division(listOfTestNumbers[i].a, listOfTestNumbers[i].b), result, `Division result should be ${result}`);
    }
  });
});

describe("Exponentiation", function () {
  it("Exponentiation in 3", function () {
    calc.exponentiation(0).should.equal(0, "Exponentiation result should be 0");
    calc.exponentiation(3).should.equal(27, "Exponentiation result should be 27");
    calc.exponentiation(-5).should.equal(-125, "Exponentiation result should be -125");
    calc.exponentiation(-5).should.not.equal(125, "Exponentiation result shouldn't be 125");

    for (let i = 0; i < listOfTestNumbers.length; i++) {
      const result = listOfTestNumbers[i].a ** 3;
      calc.exponentiation(listOfTestNumbers[i].a).should.equal(result, `Exponentiation result should be ${result}`);
    }
  });
});