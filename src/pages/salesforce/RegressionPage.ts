// import { Page } from "@playwright/test";
// import { BasePage } from "../../core/base/BasePage";
// import { urls } from "../../../config/urls";
// import { SalesforceUtils } from "../../core/utils/SalesforceUtils";
// import { SalesforceWaitUtils } from "../../core/utils/SalesforceWaitUtils";

// export class RegressionPage extends BasePage {
//   constructor(page: Page) {
//     super(page);
//   }

//   async open(): Promise<void> {
//     await this.page.goto(urls.loginUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
//     await SalesforceWaitUtils.waitForLightningReady(this.page);
//     await SalesforceWaitUtils.waitForSpinnerToDisappear(this.page);
//   }

//   async login(): Promise<void> {
//     await this.page.waitForLoadState("domcontentloaded", { timeout: 60000 }).catch(() => {});
//     const currentUrl = this.page.url().toLowerCase();
//     if (SalesforceUtils.isLoggedIn(currentUrl)) {
//       console.log("User is already authenticated. Skipping SSO click.");
//       return;
//     }
//     await this.perform("click", "Log in with");
//   }

//   async isLoggedIn(): Promise<boolean> {
//     await this.page.waitForLoadState("domcontentloaded", { timeout: 60000 }).catch(() => {});
//     return SalesforceUtils.isLoggedIn(this.page.url().toLowerCase());
//   }
// }
import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/BasePage";
import { urls } from "../../../config/urls";

export class RegressionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto(urls.loginUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await this.page
      .waitForLoadState("load", { timeout: 15000 })
      .catch(() => {});
    await this.page.waitForTimeout(2000);
  }

  async login(): Promise<void> {
    await this.page
      .waitForLoadState("domcontentloaded", { timeout: 60000 })
      .catch(() => {});

    const currentUrl = this.page.url().toLowerCase();

    const alreadyAuthenticated =
      currentUrl.includes("lightning") ||
      currentUrl.includes("salesforce.com/home") ||
      currentUrl.includes("/lightning");

    if (alreadyAuthenticated) {
      console.log("User is already authenticated. Skipping SSO click.");
      return;
    }

    await this.perform("click", "Log in with");
  }

  async isLoggedIn(): Promise<boolean> {
    await this.page
      .waitForLoadState("domcontentloaded", { timeout: 60000 })
      .catch(() => {});

    const currentUrl = this.page.url().toLowerCase();

    return (
      currentUrl.includes("lightning") ||
      currentUrl.includes("salesforce") ||
      currentUrl.includes("sso") ||
      currentUrl.includes("okta") ||
      currentUrl.includes("auth") ||
      currentUrl.includes("oauth") ||
      currentUrl.includes("login.microsoftonline")
    );
  }
}
