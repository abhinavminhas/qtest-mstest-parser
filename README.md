# **qTest-MSTest-Parser**
*qTest parser for MSTest (.trx) test result files*. </br></br>
![qtest-mstest-parser](https://github.com/abhinavminhas/qtest-mstest-parser/actions/workflows/build.yml/badge.svg)
[![codecov](https://codecov.io/gh/abhinavminhas/qtest-mstest-parser/branch/main/graph/badge.svg?token=JZRDLOU856)](https://codecov.io/gh/abhinavminhas/qtest-mstest-parser)
![maintainer](https://img.shields.io/badge/Creator/Maintainer-abhinavminhas-e65c00)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/abhinavminhas/qtest-mstest-parser?label=Github%20Release)](https://github.com/abhinavminhas/qtest-mstest-parser/releases)

Tricentis [qTest](https://www.tricentis.com/products/unified-test-management-qtest/) is a Test Management tool. It's centralizing automated test execution and management, [qTest Launch](https://www.tricentis.com/resources/qtest-launch-test-automation-management/) enables enterprises to scale test automation.

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
   <img src="https://user-images.githubusercontent.com/17473202/137570712-1c16433a-f2be-45c9-a857-dd9764a9a915.png" > </img>
3. Parser mapping configuration as per qTest automation mapping under 'Automation Settings'

   <img src="https://user-images.githubusercontent.com/17473202/137570732-af07827f-2519-47bb-bbe3-fe5abf30db0c.png" > </img>

   | MSTest test outcome statuses | Mapped qTest automation status |
   | :---: | :---: |
   | Failed | FAIL |
   | Inconclusive | SKIP |
   | Passed | PASS |
   | Error | FAIL |
   | Timeout | FAIL |
   | Aborted | FAIL |
   | Unknown | SKIP |
   | NotExecuted | SKIP |

## Steps To Configure:

1. Download zipped parser from latest release under [Releases](https://github.com/abhinavminhas/qtest-mstest-parser/releases).  
   Artifact Name: "**qtest-mstest-parser.zip**".  

   It can also be downloaded form latest successful "*qTest-MSTest-Parser*" [workflow](https://github.com/abhinavminhas/qtest-mstest-parser/actions/workflows/build.yml) artifacts.

   <img src="https://user-images.githubusercontent.com/17473202/137570746-b66adc87-a5ce-4a6c-a2d9-427066c23689.png" > </img>

   - Required zipped file contents (for manually creating zipped file)
        ```
        node_modules/
        package.json
        package-lock.json
        parser.js
        ```

      **NOTE:** *Generated 'node_modules' package folder also needs to be part of the zipped file.*

2. Login to qTest and open 'Launch' from menu < <img src="https://user-images.githubusercontent.com/17473202/137571224-165dc5a7-f75f-427e-9432-660679b72578.png" width ="28px"> </img> >.

   <img src="https://user-images.githubusercontent.com/17473202/137571310-d26392b2-6e7f-4cc4-9d9a-d9b6550746f6.png"> </img>

3. Open settings < <img src="https://user-images.githubusercontent.com/17473202/137571346-bf8ded0f-e1d0-40d2-b4bb-eda65c053388.png"> </img> > and click '**ADD**'.

   <img src="https://user-images.githubusercontent.com/17473202/137571400-6164641f-a2e5-4b16-9fdd-258eabe1e98a.png"> </img>

4. Add below parser details and '**SAVE**'.
    - **Name**: <*name of parser*>
    - **Version**: <*version of parser*>
    - **Zip package**: <*path to the downloaded parser .zip file*> </br>

   <img src="https://user-images.githubusercontent.com/17473202/137571410-84d5d2e3-7441-4f5b-844b-312d4fe67f9b.png"> </img>

5. Once the parser is saved the custom parser should be created in the list.

   <img src="https://user-images.githubusercontent.com/17473202/137571422-5622c78e-19b6-4044-bd44-a419d3d2e4b5.png"> </img>

## Configure Automation Host Agent To Use The Parser:

1. From automation host agent add new agent and provide below details.
   - **Agent Nam**e: <*name of agent*>
   - **qTest Manager Project**: <*qTest project to execute automated tests for*>
   - **Agent Type**: "*Universal Agent*"
   - **Pre-Execute Script**: <*pre-execute script*>
   - **Execute Command**: <*execution script*>
   - **Path to Results**: <*path to the test result (.trx) files*>
   - **Result Parser**: <*MSTest (custom) parser added above*> </br>
   
   <img src="https://user-images.githubusercontent.com/17473202/137571430-0786f5f5-2a5c-4794-b261-89a0134c797c.png"> </img>

   **NOTE:** *Ensure the final command in '_**Executor**_' block does not generate failed output (e.g. test run with failed tests), may avoid the parser from executing. To avoid try adding log output command in the end. (e.g. batch -> echo Completed)*
      ##### [ Example ] #####
      ```
      echo :::: EXECUTION STARTED ::::
      <Path to>\VsTest.console.exe <Path to>\Test.dll /TestCaseFilter:Name=Test1 /Logger:trx;LogFileName=TestResultFile.trx
      echo :::: EXECUTION COMPLETED ::::
      ```

## Parsed Test Results:

1. Results parsed for test run.
   
   <img src="https://user-images.githubusercontent.com/17473202/137571439-421c7867-2ad3-4902-83b7-30a3a4ebbed6.png"> </img>

2. Multiple test runs created for a particular test case run executed multiple times in a day.
   
   <img src="https://user-images.githubusercontent.com/17473202/137571445-4682af87-b8f9-4027-b678-ac95880bb541.png"> </img>

3. Log attachments created for each test run.
   
   <img src="https://user-images.githubusercontent.com/17473202/137571457-9ad19b2e-1a8b-4579-aa46-1339bbf87ff6.png"> </img>
