const assert = require("assert");
const {
  isNumber,
  handleErrors,
  extractNumber,
  getHead,
  extractOption,
  extractNoOfLines,
  extractCharacters,
  extractLines,
  extractInputs,
  createHeadLines
} = require("../src/lib.js");

//---------------------extractInputs tests-------------------
describe("extractInputs", function() {
  it("should return headDetails including option when option is given", function() {
    let userArgs = [, , "-n5", "file1"];
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-n", "5", "file1"];
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-c5", "file1", "file2"];
    expectedOutput = { option: "c", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });

  it("should return headDetails excluding option when option is not given", function() {
    let userArgs = [, , "-5", "file1"];
    let expectedOutput = { option: "n", noOfLines: 5, files: ["file1"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);

    userArgs = [, , "-5", "file1", "file2"];
    expectedOutput = { option: "n", noOfLines: 5, files: ["file1", "file2"] };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });

  it("should return headDetails including all the files when multiple files as an input", function() {
    let userArgs = [, , "file1", "file2"];
    let expectedOutput = {
      option: "n",
      noOfLines: 10,
      files: ["file1", "file2"]
    };
    assert.deepEqual(extractInputs(userArgs), expectedOutput);
  });
});

//-------------------------createHeadLines tests--------------
describe("createHeadLines", function() {
  it("should return the heading for the given function", function() {
    assert.deepEqual(createHeadLines("mars"), "==> mars <==");
    assert.deepEqual(createHeadLines("sample"), "==> sample <==");
  });
});

//-----------------------------extractLines tests------------
describe("extractLines", function() {
  it("should return the head with given number of lines", function() {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    let expectedOutput = "fhash\nhsakh\nfkdsh";
    assert.deepEqual(extractLines(data, 3), expectedOutput);

    data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    expectedOutput = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk\n";
    assert.deepEqual(extractLines(data, 7), expectedOutput);
  });
});

//----------------------extractCharacters tests---------------
describe("extractCharacters", function() {
  it("should return the head with the given number of characters", function() {
    let data = "fhash\nhsakh\nfkdsh\nhsaklf\nkjfdhs\ndkfsfk";
    let expectedOutput = "fha";
    assert.deepEqual(extractCharacters(data, 3), expectedOutput);
    expectedOutput = "fhash\nh";
    assert.deepEqual(extractCharacters(data, 7), expectedOutput);
  });
});

//--------------------------extractOption tests---------------
describe("extractOption", function() {
  it("should extract the -c or -n option for given input", function() {
    assert.deepEqual(extractOption("-c5"), "c");
    assert.deepEqual(extractOption("-c"), "c");
    assert.deepEqual(extractOption("-5"), "n");
  });
});

//-------------------------extractNoOfLines tests-------------------
describe("extractNoOfLines", function() {
  it("should extract the no of lines from the given input", function() {
    assert.deepEqual(extractNoOfLines(["-c5", ""]), { lines: 5, index: 3 });
    assert.deepEqual(extractNoOfLines(["-5", ""]), { lines: 5, index: 3 });
    assert.deepEqual(extractNoOfLines(["-c", "2"]), { lines: 2, index: 4 });
    assert.deepEqual(extractNoOfLines(["file1", "file2"]), {
      lines: 10,
      index: 2
    });
  });
});

//--------------------------getHead tests---------------------

describe("getHead", function() {
  let readFileSync = file => file;
  let existsSync = file => true;
  let fs = { readFileSync, existsSync };

  it("should return head of the file with given specifications", function() {
    let data = "fsdjfhsdh\ndfjkshjk\ndsfjdfdkjfs";
    let userArgs = [, , "-n2", data];
    assert.deepEqual(getHead(userArgs, fs), "fsdjfhsdh\ndfjkshjk");

    data = "grldfjd";
    userArgs = [, , "-c", "4", data];
    assert.deepEqual(getHead(userArgs, fs), "grld");
  });
});

//----------------------validateNoOfLines tests--------------
describe("extractNumber", function() {
  it("should extract Number from the given input", function() {
    assert.deepEqual(extractNumber(["-n", "1"]));
    assert.deepEqual(extractNumber(["-n12", "temp.js"]), {
      lines: "12",
      index: 3
    });
    assert.deepEqual(extractNumber(["-100", "temp.js"]), {
      lines: "100",
      index: 3
    });
  });
});

//-------------------------handleErrors tests----------------
describe("handleErrors", function() {
  it("should return error message for illegal option", function() {
    let optionError =
      "head: illegal option -- " +
      "s" +
      "\nusage:head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(handleErrors("s", "12"), optionError);
    assert.deepEqual(handleErrors("sd", "1"), optionError);
  });

  it("should return error message for illegal line count", function() {
    let lineError = "head: illegal line count -- " + "0";
    assert.deepEqual(handleErrors("n", 0), lineError);
    lineError = "head: illegal line count -- " + "-1";
    assert.deepEqual(handleErrors("n", -1), lineError);
  });

  it("should return error message for illegal byte count", function() {
    let byteError = "head: illegal byte count -- " + "0";
    assert.deepEqual(handleErrors("c", 0), byteError);
    byteError = "head: illegal byte count -- " + "-1";
    assert.deepEqual(handleErrors("c", -1), byteError);
  });
});

describe("isNumber", function() {
  it("should return number and index if the given input is a number", function() {
    assert.deepEqual(isNumber("12", 3), { lines: "12", index: 3 });
    assert.deepEqual(isNumber("1", 3), { lines: "1", index: 3 });
  });
});
