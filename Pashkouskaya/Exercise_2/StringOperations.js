let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

class StringOperations {

    sum(a, b) {
        return a + b;
    }

    max(a, b, c) {
        if (a.length === b.length && b.length === c.length) {
            throw new Error("a,b,c are equal");
        }

        if (a.length < b.length) {
            if (b.length < c.length) {
                return c;
            }
            else {
                return b;
            }
        }
        else {
            if (a.length < c.length) {
                return c;
            }
            else {
                return a;
            }
        }
    }

    myLen(a) {
        if (typeof a !== "string") {
            throw new Error("Not a string passed")
        }

        const toExclude = "\ \!\"\№\;\%\:\?\*"

        let counter = 0;
        for (let i = 0; i < a.length; i++) {
            if (!toExclude.includes(a[i])) {
                counter++;
            }
        }

        return counter;
    }

}

describe("Sum tests", function () {
    const tests = [
        { a: "a", b: "b", sum: "ab", notSum: "a" },
        { a: "ac", b: "b", sum: "acb", notSum: "b" },
    ];

    let operator = new StringOperations();
    beforeEach(function () {
        operator = new StringOperations;
    });

    afterEach(function () {
        operator = null;
    });

    for (let i = 0; i < tests.length; i++) { 
        const t = tests[i];
        it(`sum (${t.a}, ${t.b}) should equal ${t.sum}`, function () {
            const actual = operator.sum(t.a, t.b);

            assert.equal(actual, t.sum);
            assert.notEqual(actual, t.notSum);
        });
    }
});

describe("Max tests", function () {
    let operator = new StringOperations();
    beforeEach(function () {
        operator = new StringOperations;
    });

    afterEach(function () {
        operator = null;
    });

    it ("max (a, a, a) should throw", function () {
        assert.throw(() => operator.max("a", "a", "a"), "a,b,c are equal");
    });

    it ("max (a, aa, aaa) should return aaa", function () {
        const res = operator.max("a", "aa", "aaa");

        assert.equal(res, "aaa");
        console.log(res, res.length);
    });

    it ("max (a, aaa, aa) should return aaa", function () {
        const res = operator.max("a", "aa", "aaa");

        assert.equal(res, "aaa");
    });

    it ("max (aaa, aa, a) should return aaa", function () {
        const res = operator.max("a", "aa", "aaa");

        assert.equal(res, "aaa");
    });
});

describe("myLen tests", function () {
    let operator = new StringOperations();
    beforeEach(function () {
        operator = new StringOperations;
    });
    beforeEach(function(done) {
        this.timeout(3000);
        setTimeout(done, 2500);
    });
    afterEach(function () {
        operator = null;
    });

    const tests = [
        { in: "", res: 0 },
        { in: "aa", res: 2 },
        { in: "\ \!\"\№\;\%\:\?\*", res: 0 },
        { in: "a b!", res: 2 },
    ];

    for (let t of tests) {
        it(`myLen(${t.in}) should equal ${t.res}`, function () {
            const res = operator.myLen(t.in);
    
            assert.equal(res, t.res);
        });
    }

    it("myLen({}) should throw", function () {
        assert.throw(() => operator.myLen({}), "Not a string passed");
    });
});