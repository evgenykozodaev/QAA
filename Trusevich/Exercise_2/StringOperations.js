let chai = require('chai');
let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();

class StringOperations {
  constructor() { }

  sumOfTwoStrings(firstString, secondString) {
    return (firstString + secondString);
  }

  maxStringAndItsCount(firstString, secondString, thirdString) {
    let array;
    if (typeof firstString === 'string' && typeof secondString === 'string' && typeof thirdString === 'string') {
      array = [
        { string: firstString, length: firstString.length },
        { string: secondString, length: secondString.length },
        { string: thirdString, length: thirdString.length },
      ];
    } else {
      throw new Error("There is no string for compare");
    }
    //https://learn.javascript.ru/array-methods
    array.sort(function (a, b) {
      if (a.length > b.length) return -1;
      if (a.length === b.length) return 0;
      if (a.length < b.length) return 1;
    })

    const maxStringLenth = array[0].length;

    let resultArray = array.filter(item => item.length === maxStringLenth);

    return resultArray;
  }

  lengthOfModifiedString(string) {
    if (typeof string === 'string') {
      return string.replace(/[!"№;%:#?@#$^&* ]/g, "").length
    } else {
      throw new Error("There is no any string");
    }
  }
}



//Tests
const strings = new StringOperations();

beforeEach(function () {
  console.log('Result of test:');
})

before(function (done) {
  setTimeout(function () {
    done();
  }, 500)
});

describe.only('Sum Of Two Strings', function () {
  it('Sum of two strings is correct', function () {
    assert.strictEqual(strings.sumOfTwoStrings('2+4', '=6'), '2+4=6', 'Sum of two strings should be "2+4=6"');
    assert(String(strings.sumOfTwoStrings('Sum of two ', 'different strings')) != 'Sum of two ', 'Sum of two strings should be "Sum of two different strings"');
    assert.isString(strings.sumOfTwoStrings(2, '5'), '25');
    assert.isNaN(strings.sumOfTwoStrings(), 'Nan is NaN');
  })
})

describe('Max String And Its Length', function () {
  it.only('Max string and its length are correct', function () {
    let newString = 'New test string and its length';
    let str1 = newString.substring(0, 15);
    let str2 = newString.substring(0, 25);
    let str3 = newString.substring(0, 20);
    expect(strings.maxStringAndItsCount(str1, str2, str3)).to.eql([{ string: 'New test string and its l', length: 25 }]);
  })

  it.only('Two max strings and their length are correct', function () {
    let newString = 'New test string and its length!';
    let str1 = newString.substring(0, 27);
    let str2 = newString.substring(0, 5);
    let str3 = newString.substring(0, 27);
    expect(strings.maxStringAndItsCount(str1, str2, str3)).to.be.an('array');
    expect(strings.maxStringAndItsCount(str1, str2, str3)).to.have.lengthOf(2);
    expect(strings.maxStringAndItsCount(str1, str2, str3)).to.have.deep.members([{ string: 'New test string and its len', length: 27 }, { string: 'New test string and its len', length: 27 }]);
    expect(function () { strings.maxStringAndItsCount(str2) }).to.throw("There is no string for compare");
  })

  it.only('Skip test', function () {
    let newString = 'New test string and its length!';
    let str1 = newString.substring(0, 27);
    let str2 = newString.substring(0, 5);
    let str3 = newString.substring(0, 15);
     
    if (str1 !== null && str2 !== null && str3 !== null) {
      this.skip(expect(function () { strings.maxStringAndItsCount(str1, str2) }).to.throw("There is no string for compare"));
    } 
  })

  it.only('Three max strings and their length are correct', function() {
    let newString = 'New test string and its length!';
    let str1 = newString.substring(0, 5);
    let str2 = newString.substring(0, 5);
    let str3 = newString.substring(0, 5);
    assert.isArray(strings.maxStringAndItsCount(str1, str2, str3), 'Three max strings and their length should be displayed');
    assert.lengthOf(strings.maxStringAndItsCount(str1, str2, str3), 3, '3 max strings should be displayed');
    assert.throws(function () { strings.maxStringAndItsCount() },"There is no string for compare");
  })

  it('It will not be run', function () {
    expect(strings.maxStringAndItsCount()).to.be.null;
  })
})

describe.only('Modify String And Count Its Length', function () {
  var testData = [
    { args: ['Test string without any specific symbols'], expected: 35 },
    { args: ['Teststringwithoutanyspecificsymbolsandspaces'], expected: 44 },
    { args: ['Test@string#with$specific*symbols&and space'], expected: 37 },
    { args: ['!@#$   %^&* '], expected: 0 }
  ];

  testData.forEach(function (test) {
    it('Length is correct', function () {
      var res = strings.lengthOfModifiedString.apply(null, test.args);
      assert.equal(res, test.expected);
    })
  })

  it('Modified string and its length is correct', function () {
    expect(strings.lengthOfModifiedString('test string!@#$%^')).to.be.a('number');
    expect(function () { strings.lengthOfModifiedString() }).to.throw("There is no any string");
  })
})

after(function () {
  console.log('Test run is finished');
})
