# Enterprise Test Automation Framework for AUT (HoneycompICP)

## 1. Overview

The enterprise test automation framework is designed to provide a robust, scalable, and feature-rich solution for automated testing of the Salesforce application (AUT). The framework encompasses various features, including data-driven testing, logging, retry mechanism, self-healing, cross-browser testing, multiple enviornments, password encryption, code quality, CI/CD integration, reusable utilities, data generation, parallel testing, and API mocking/testing. 

## 2. Features

### 2.1 Page Object Model (POM) Implementation 

- **Objective:** Apply POM Principle to structure the code and make reusable & maintainable code. 

### 2.2 Data-Driven Testing

- **Objective:** Enhance test coverage by parameterizing tests with external data. 

### 2.3 Loggin 

- **Objective:** Provide comprehensive logs for detailed test execution analysis.

### 2.4 Retry Mechanism 

- **Objective:** Handle intermittent failures gracefully with automatic retries 

### 2.5 Self-Healing 

- **Objectives:** Adapot to dynamic changes in the Salesforce application to minimize maintenance efforts. 


### 2.6 Cross-Browser Testing

- **Objective:** Validate application functionality accross different browsers 

### 2.7 Multiple Enviornments

- **Objective:** Support testing in various enviornments (e.g., sandbox, development,QA,Staging, UAT, prod)

### 2.8 Password Encryption 

- **Objective:** Securely manage and use passwords in test scenarios. 

### 2.9 Code Quality

- **Objective:** Enforce coding standards and maintain high-quality code.

### 2.10 CI/CD Integration 

- **Objective:** Seamlessy integrate the framework with CI/CD pipelines.

### 2.11 Reusable Utilities

- **Objective:** Develop modular and reusable utilities to optimize code maintenance. 

### 2.12 Data Generation 

- **Objective:** Generate test data dynamically to ensure diverse test scenarios.

### 2.13 Parallel Testing 

- ***Objective:** Execute tests concurrently for faster feedback and optimized test suite execution.

### 2.14 API Mocking/Testing

- ***Objective:** Mock and test Salesforce APIs to validate backend functionality.

## 3. Test Scenarios (Sample)

**Scenario:** Verify creation of Page class for login page and create basic test. 

**Steps:** 

1. Create POM Class for login page.
2. Create Tests using Page class and its methods to login.
- Log in to Salesforce.
- Verify the success of login


### 3.2 Data-Driven Testing

**Scenarion:** Verify creation of Salesforce records using different sets of data.

**Steps:**
1. Retrieve test data from an external source.
2. For each set of data: 



