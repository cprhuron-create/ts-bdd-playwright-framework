import { Given, When, Then } from "@cucumber/cucumber";
import { RegressionPage } from "../pages/salesforce/RegressionPage";
import { AppLauncherPage } from "../pages/salesforce/AppLauncherPage";
import { HomePage } from "../pages/salesforce/HomePage";
import { AccountsPage } from "../pages/salesforce/AccountsPage";

Given("the user is on the Salesforce login page", async function () {
  this.regressionPage = new RegressionPage(this.page);
  await this.regressionPage.open();
});

When("the user clicks the SSO login option", async function () {
  await this.regressionPage.login();
});

When("the user performs {string} on {string}", async function (action: "click" | "fill" | "type", elementName: string) {
  await this.regressionPage.perform(action, elementName);
});

When("the user performs {string} on {string} with value {string}", async function (action: "click" | "fill" | "type", elementName: string, value: string) {
  await this.regressionPage.perform(action, elementName, value);
});

When("the user opens app {string}", async function (appName: string) {
  const appLauncher = new AppLauncherPage(this.page);
  await appLauncher.openAppLauncher();
  await appLauncher.searchApp(appName);
  await appLauncher.openApp(appName);
});

When("the user clicks button {string}", async function (buttonName: string) {
  const homePage = new HomePage(this.page);
  await homePage.clickButton(buttonName);
});

When("the user clicks tab {string}", async function (tabName: string) {
  const homePage = new HomePage(this.page);
  await homePage.clickTab(tabName);
});

When("the user enters account name {string}", async function (accountName: string) {
  const accountsPage = new AccountsPage(this.page);
  await accountsPage.enterAccountName(accountName);
});

Then("the user should be redirected to SSO or Salesforce Lightning", async function () {
  await this.page.waitForTimeout(5000);
  const currentUrl = this.page.url();
  console.log("Current URL after login handling:", currentUrl);
  const success = await this.regressionPage.isLoggedIn();
  if (!success) throw new Error(`User did not reach expected destination. Current URL: ${currentUrl}`);
});
