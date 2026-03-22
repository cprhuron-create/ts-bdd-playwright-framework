@regression @login
Feature: Regression

  Scenario: Login using SSO
    Given the user is on the Salesforce login page
    When the user clicks the SSO login option
    Then the user should be redirected to SSO or Salesforce Lightning
