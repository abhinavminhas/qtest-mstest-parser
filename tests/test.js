const assert = require('assert');
const parser = require('../parser.js');
const fs = require('fs');
const xml2js = require('xml2js');

(async () => {
    console.log('🧪🔹 [ TEST 1 - Parse MSTest (TestResults-DifferentTestOutcomes.trx) results file with different test outcomes (using path with filename). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/TestResults-DifferentTestOutcomes.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //All records exist comparison.
    assert(resultString.includes('"order": 1'));
    assert(resultString.includes('"order": 2'));
    assert(resultString.includes('"order": 3'));
    assert(resultString.includes('"order": 4'));
    assert(resultString.includes('"order": 5'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 6'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 2 - Parse MSTest (TestResults-AllPassedOutcomes.trx) results file with all passed test outcomes (using path with filename). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/TestResults-AllPassedOutcomes.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //All records exist comparison.
    assert(resultString.includes('"order": 1'));
    assert(resultString.includes('"order": 2'));
    assert(resultString.includes('"order": 3'));
    assert(resultString.includes('"order": 4'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 5'));
    //Not includes status as 'FAIL' comparison.
    assert(!resultString.includes('"status": "FAIL"'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 3 - Parse MSTest (TestResults-AllFailedOutcomes.trx) results file with all failed test outcomes (using path with filename). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/TestResults-AllFailedOutcomes.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //All records exist comparison.
    assert(resultString.includes('"order": 1'));
    assert(resultString.includes('"order": 2'));
    assert(resultString.includes('"order": 3'));
    assert(resultString.includes('"order": 4'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 5'));
    //Not includes status as 'PASS' comparison.
    assert(!resultString.includes('"status": "PASS"'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 4 - Parse MSTest (TestResults-WithAttachments.trx) results file with attachment details (using path with filename). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/TestResults-WithAttachments.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //All records exist comparison.
    assert(resultString.includes('"order": 1'));
    assert(resultString.includes('"order": 2'));
    assert(resultString.includes('"order": 3'));
    assert(resultString.includes('"order": 4'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 5'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 5 - Parse all MSTest (.trx) result files (using path to result files - path ending /). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //Record start comparison.
    assert(resultString.includes('"order": 1'));
    //Record end comparison.
    assert(resultString.includes('"order": 17'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 18'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 6 - Parse all MSTest (.trx) result files (using path to result files - path not ending /). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //Record start comparison.
    assert(resultString.includes('"order": 1'));
    //Record end comparison.
    assert(resultString.includes('"order": 17'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 18'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 7 - Parse all MSTest (.trx) result files (using matching pattern - *.trx /). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/*.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //Record start comparison.
    assert(resultString.includes('"order": 1'));
    //Record end comparison.
    assert(resultString.includes('"order": 17'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 18'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 8 - Parse all MSTest (.trx) result files (using matching pattern - **/*.trx /). ] 🔹🧪');
    let result = await parser.parse('./tests/sample-mstest-results/**/*.trx', null);
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //Record start comparison.
    assert(resultString.includes('"order": 1'));
    //Record end comparison.
    assert(resultString.includes('"order": 17'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 18'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 9 - Get test case outcome status mappings (MSTest -> qTest) test. ] 🔹🧪');
    //Different test outcome statuses comparison.
    let result = parser.getTestCaseStatus('Failed');
    assert.equal(result, 'FAIL');
    result = parser.getTestCaseStatus('Inconclusive');
    assert.equal(result, 'SKIP');
    result = parser.getTestCaseStatus('Passed');
    assert.equal(result, 'PASS');
    result = parser.getTestCaseStatus('Error');
    assert.equal(result, 'FAIL');
    result = parser.getTestCaseStatus('Aborted');
    assert.equal(result, 'FAIL');
    result = parser.getTestCaseStatus('Timeout');
    assert.equal(result, 'FAIL');
    result = parser.getTestCaseStatus('Unknown');
    assert.equal(result, 'SKIP');
    result = parser.getTestCaseStatus('NotExecuted');
    assert.equal(result, 'SKIP');
    result = parser.getTestCaseStatus('SomethingElse');
    assert.equal(result, 'FAIL');
})();

(async () => {
    console.log('🧪🔹 [ TEST 10 - HTML entities test. ] 🔹🧪');
    //HTML entities conversion check
    let result = parser.htmlEntities('&');
    assert.equal(result, '&amp;');
    result = parser.htmlEntities('<');
    assert.equal(result, '&lt;');
    result = parser.htmlEntities('>');
    assert.equal(result, '&gt;');
    result = parser.htmlEntities('"');
    assert.equal(result, '&quot;');
})();

(async () => {
    console.log('🧪🔹 [ TEST 11 - Delay test. ] 🔹🧪');
    let waitTime = Math.floor(Math.random() * (4000 - 1000) + 1000);
    let timeNow = new Date().getTime();
    parser.delay(waitTime);
    let timeAfter = new Date().getTime();
    assert.ok(timeAfter >= (timeNow + waitTime));
})();

(async () => {
    console.log('🧪🔹 [ TEST 12 - Max delay test.');
    let waitTime = 20001;
    let timeNow = new Date().getTime();
    parser.delay(waitTime);
    let timeAfter = new Date().getTime();
    assert.ok(timeAfter >= (timeNow + 20000));
})();

(async () => {
    console.log('🧪🔹 [ TEST 13 - Parse MSTest (TestResults-DifferentTestOutcomes.trx) results file with different test outcomes (using path with filename) & delay option. ] 🔹🧪');
    let waitTime = Math.floor(Math.random() * (4000 - 1000) + 1000);
    let result = await parser.parse('./tests/sample-mstest-results/TestResults-DifferentTestOutcomes.trx', { delay: waitTime });
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //All records exist comparison.
    assert(resultString.includes('"order": 1'));
    assert(resultString.includes('"order": 2'));
    assert(resultString.includes('"order": 3'));
    assert(resultString.includes('"order": 4'));
    assert(resultString.includes('"order": 5'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 6'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 14 - Parse all MSTest (.trx) result files (using path to result files - path ending /) & delay option. ] 🔹🧪');
    let waitTime = Math.floor(Math.random() * (4000 - 1000) + 1000);
    let result = await parser.parse('./tests/sample-mstest-results/', { delay: waitTime });
    let resultString = JSON.stringify(result, null, 4);
    //console.log(resultString);
    //Record start comparison.
    assert(resultString.includes('"order": 1'));
    //Record end comparison.
    assert(resultString.includes('"order": 17'));
    //Not other records exist comparison.
    assert(!resultString.includes('"order": 18'));
})();

(async () => {
    console.log('🧪🔹 [ TEST 15 - Test result files not found. ] 🔹🧪');
    try{
        await parser.parse('./tests/invalid-mstest-result-files/path-with-no-mstest-results/', null);
    } catch(e) {
        let errorMessage = e.message;
        assert.equal(errorMessage, "Could not find any result log-file(s) in: './tests/invalid-mstest-result-files/path-with-no-mstest-results/'");
    }
})();

(async () => {
    console.log('🧪🔹 [ TEST 16 - Invalid test results file. ] 🔹🧪');
    let results = await parser.parse('./tests/invalid-mstest-result-files/TestResults-Invalid.trx', null);
    assert.equal(results.length, 0);
})();

(async () => {
    console.log("🧪🔹 [ TEST 17 - Should log an error when XML parsing fails. ] 🔹🧪");

    // Spy on console.error
    let consoleErrorSpy = [];
    const originalConsoleError = console.error;
    console.error = (msg, err) => {
        consoleErrorSpy.push(msg);
        originalConsoleError(msg, err);
    };

    // Backup original functions
    const originalReadFileSync = fs.readFileSync;
    const originalStatSync = fs.statSync;
    const originalParseString = xml2js.parseString;

    try {
        // Mock
        fs.statSync = () => ({ isFile: () => true });
        fs.readFileSync = () => "<TestRun><Invalid></TestRun>";
        xml2js.parseString = (data, options, callback) => {
            callback(new Error("Invalid XML format"), null);
        };

        // Call the function
        let result = await parser.parse("./tests/sample-mstest-results/TestResults-Invalid.trx", null);
        assert(Array.isArray(result));
        assert(result.length === 0);
        assert(consoleErrorSpy.some(msg => msg.includes("Could not parse ./tests/sample-mstest-results/TestResults-Invalid.trx")), "Error log not found in console.error");
    } finally {
        // Restore original functions
        fs.statSync = originalStatSync;
        fs.readFileSync = originalReadFileSync;
        xml2js.parseString = originalParseString;
        console.error = originalConsoleError;
    }
})();