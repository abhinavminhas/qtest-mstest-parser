/** 
 * Parsing MSTest (.trx) test results report.
 */
 "use strict"

 const fs = require('fs');
 const globby = require('globby');
 const xml2js = require('xml2js');
 const packageJson = require('./package.json');
 
 /**
  * Convert MSTest test case outcome status to qTest compatible test case outcome status.
  * @param {string} testCaseStatus Test case status from MSTest (.trx) results file.
  * @returns qTest compatible test case outcome status.
  */
 function getTestCaseStatus(testCaseStatus) {
     if (testCaseStatus == 'Failed') {
         return "FAIL";
     } else if (testCaseStatus == 'Inconclusive') {
         return "SKIP";
     } else if (testCaseStatus == 'Passed') {
         return "PASS";
     } else if (testCaseStatus == 'Error') {
         return "FAIL";
     } else if (testCaseStatus == 'Timeout') {
         return "FAIL";
     } else if (testCaseStatus == 'Aborted') {
         return "FAIL";
     } else if (testCaseStatus == 'Unknown') {
         return "SKIP";
     } else if (testCaseStatus == 'NotExecuted') {
         return "SKIP";
     }
     return "FAIL";
 }
 
 /**
  * Convert string data to HTML entities.
  * @param {string} str String to convert.
  * @returns String with HTML entities.
  */
 function htmlEntities(str) {
     return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
 }
 
 /**
  * Adds delay to the parser execution.
  * @param {string} ms Time in milliseconds (max 20 secs).
  */
 function delay(ms) {
     if (ms > 20000) {
         ms = 20000
     }
     ms += new Date().getTime();
     while (new Date() < ms) {}
 }
 
 /**
  * Parse multiple MSTest (.trx) test result files.
  * @param {string} pathToTestResult Path to result file directory or test result (.trx) file.
  * @param {object} options Parser options. None Implemented.
  * @returns Test results.
  */
 function parse(pathToTestResult, options) {
     return new Promise((resolve, reject) => {
 
         if (options != null && options['delay'] != undefined) {
             delay(options['delay']);
         }
 
         //Parser (Start)
         console.log(` == Parser name: ${packageJson.name}, version ${packageJson.version} ==`);
         console.log("Path to test result: " + pathToTestResult);
         let resultFiles = [];
         if (-1 !== pathToTestResult.indexOf("*")) {
             resultFiles = globby.sync(pathToTestResult);
         } else if (fs.statSync(pathToTestResult).isFile()) {
             resultFiles.push(pathToTestResult);
         } else if (fs.statSync(pathToTestResult).isDirectory()) {
             let pattern = undefined;
             pathToTestResult = pathToTestResult.replace(/\\/g, "/");
             if (pathToTestResult[pathToTestResult.length - 1] === '/') {
                 pattern = pathToTestResult + "**/*.trx";
             } else {
                 pattern = pathToTestResult + "/**/*.trx";
             }
             resultFiles = globby.sync(pattern);
         }
         if (0 === resultFiles.length) {
             throw new Error(`Could not find any result log-file(s) in: '${pathToTestResult}'`);
         }
         let resultMap = new Map();
         let order = 1;
         for (let file of resultFiles) {
             var outPut = undefined;
             var errorInfoMessage = undefined;
             var logOut = undefined;
             var addResultFilesAttachments = undefined;
             console.log(`== Parsing ${file} ... ==`);
             try {
                 var testResults = fs.readFileSync(file, "utf-8");
                 xml2js.parseString(testResults, {
                     preserveChildrenOrder: true,
                     explicitArray: false,
                     explicitChildren: false
                 }, function(err, result) {
                     if (err) {
                         throw err;
                     } else {
                         var testruns = Array.isArray(result['TestRun']) ? result['TestRun'] : [result['TestRun']];
                         testruns.forEach(function(ts) {
                             var runName = ts.$.id;
                             var results = Array.isArray(ts['Results']) ? ts['Results'] : [ts['Results']];
                             results.forEach(function(tc) {
                                 var unitTestResults = Array.isArray(tc['UnitTestResult']) ? tc['UnitTestResult'] : [tc['UnitTestResult']];
                                 unitTestResults.forEach(function(tm) {
                                     var testCaseName = tm.$.testName;
                                     var testCaseId = tm.$.testId;
                                     var testCaseStatus = getTestCaseStatus(tm.$.outcome);
                                     var startTime = new Date(tm.$.startTime).toISOString();
                                     var endTime = new Date(tm.$.endTime).toISOString();
                                     var testLog = {
                                         name: testCaseName,
                                         status: testCaseStatus,
                                         attachments: [],
                                         exe_start_date: startTime,
                                         exe_end_date: endTime,
                                         automation_content: htmlEntities(testCaseName),
                                         module_names: [runName],
                                         order: order++
                                     };
                                     outPut = tm['Output'];
                                     errorInfoMessage = outPut['ErrorInfo'];
                                     addResultFilesAttachments = tm['ResultFiles'];
                                     if ((typeof outPut !== 'undefined') && (outPut)) {
                                         var stdOut = outPut['StdOut'];
                                         if ((typeof stdOut !== 'undefined') && (stdOut)) {
                                             logOut = '== OUTPUT == \n' + outPut['StdOut'] + '\n\n';
                                         } else {
                                             logOut = '== OUTPUT == \n\n';
                                         }
                                         if ((typeof errorInfoMessage !== 'undefined') && (errorInfoMessage)) {
                                             var errorMessage = errorInfoMessage['Message'];
                                             if ((typeof errorMessage !== 'undefined') && (errorMessage)) {
                                                 logOut = logOut + '== ERROR INFO (MESSAGE) == \n' + errorMessage + '\n\n';
                                             }
                                             var errorStackTrace = errorInfoMessage['StackTrace'];
                                             if ((typeof errorStackTrace !== 'undefined') && (errorStackTrace)) {
                                                 logOut = logOut + '== ERROR INFO (STACKTRACE) == \n' + errorStackTrace + '\n\n';
                                             }
                                         }
                                         if ((typeof addResultFilesAttachments !== 'undefined') && (addResultFilesAttachments)) {
                                             var resultFilesAttachments = Array.isArray(addResultFilesAttachments['ResultFile']) ? addResultFilesAttachments['ResultFile'] : [addResultFilesAttachments['ResultFile']];
                                             if ((typeof resultFilesAttachments !== 'undefined') && (resultFilesAttachments)) {
                                                 logOut = logOut + '== RESULT FILE ATTACHMENTS == \n\n';
                                                 let index = 0;
                                                 for (let resultFilesAttachment of resultFilesAttachments) {
                                                     index++;
                                                     var fileName = resultFilesAttachment.$.path.split('\\').pop().split('/').pop();
                                                     logOut = logOut + index + ". " + fileName + '\n';
                                                 }
                                             }
                                         }
                                         if ((typeof logOut !== 'undefined') && (logOut)) {
                                             testLog.attachments.push({
                                                 name: `${testCaseName}.log`,
                                                 data: Buffer.from(logOut).toString("base64"),
                                                 content_type: "text/plain"
                                             });
                                         }
                                     }
                                     resultMap.set(order, testLog)
                                 });
                             });
                         });
                     }
                 });
             } catch (error) {
                 console.error(`Could not parse ${file}`, error);
                 continue;
             }
             console.log(`== Finish parsing ${file} ... ==`);
         }
         return resolve(Array.from(resultMap.values()));
         //Parser (End)
 
     });
 }
 
 module.exports = {
     parse: parse,
     getTestCaseStatus: getTestCaseStatus,
     htmlEntities: htmlEntities,
     delay: delay
 }