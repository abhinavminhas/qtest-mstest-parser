# **qTest-MSTest-parser**
*qTest parser for MSTest (.trx) test result files*. </br></br>
![qtest-mstest-parser](https://github.com/abhinavminhas/qtest-mstest-parser/actions/workflows/main.yml/badge.svg)

[Tricentis qTest](https://www.tricentis.com/products/unified-test-management-qtest/) is a Test Management tool. It's centralizing automated test execution and management, [qTest Launch](https://www.tricentis.com/resources/qtest-launch-test-automation-management/) enables enterprises to scale test automation.

**Problem Statement**: So far no in-built parser is available for MSTest (.trx) test result files in qTest, but qTest offers the option to create and use [custom parsers](https://documentation.tricentis.com/qtest/od/en/content/launch/automation_host/universal_agent/parsers/develop_custom_test_result_parser_for_universal_agent.htm) which is what has been attempted here for MSTest (.trx) test result file types. </br>

## Features

1. Can parse multiple MSTest test result (.trx) files.
2. Generated output log file attachment details.
   ````
   == OUTPUT == 
   <This section contains console/test context output logs>

   == ERROR INFO (MESSAGE) == 
   <This section contains error message in case of test failure>

   == ERROR INFO (STACKTRACE) == 
   <This section contains error details in case of test failure>
   
   == RESULT FILE ATTACHMENTS == 
   <This section lists out all test result attachment files>

   ````
   [Example]
   <img src="images\log-output.png" > </img>

## Steps To Configure:

1. Download zipped parser from latest "*qtest-mstest-parser*" [workflow](https://github.com/abhinavminhas/qtest-mstest-parser/actions/workflows/main.yml) artifacts.

   <img src="images\artifacts.png" > </img>
   - Required zipped file contents (for manually creating zipped file)
        ```
        node_modules/
        package.json
        package-lock.json
        parser.js
        ```

2. Login to qTest and open 'Launch' from menu < <img src="images\qTest-icon.png" width ="28px"> </img> >.

   <img src="images\qTest1.png"> </img>

3. Open settings < <img src="images\settings.png"> </img> > and click '**ADD**'.

   <img src="images\qTest2.png"> </img>

4. Add below parser details and '**SAVE**'.
    - **Name**: <*name of parser*>
    - **Version**: <*version of parser*>
    - **Zip package**: <*path to the downloaded parser .zip file*> </br>

   <img src="images\qTest3.png"> </img>

5. Once the parser is saved the custom parser should be created in the list.

   <img src="images\qTest4.png"> </img>

## Configure Automation Host Agent To Use The Parser:

1. From automation host agent add new agent and provide below details.
   - **Agent Nam**e: <*name of agent*>
   - **qTest Manager Project**: <*qTest project to execute automated tests for*>
   - **Agent Type**: "*Universal Agent*"
   - **Pre-Execute Script**: <*pre-execute script*>
   - **Execute Command**: <*execution script*>
   - **Path to Results**: <*path to the test result (.trx) files*>
   - **Result Parser**: <*MSTest (custom) parser added above*> </br>
   
   <img src="images\add-parser-to-agent.png"> </img>

## Parsed Test Results:

1. Results parsed for test run.
   
   <img src="images\results.png"> </img>

2. Multiple test runs created for a particular test case run executed multiple times in a day.
   
   <img src="images\execution-runs.png"> </img>

3. Log attachments created for each test run.
   
   <img src="images\execution-run-attachments.png"> </img>