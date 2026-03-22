import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/BasePage";
import { SalesforceWaitUtils } from "../../core/utils/SalesforceWaitUtils";

export class AccountsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickNew(): Promise<void> {
    await this.perform("click", "New");
    await SalesforceWaitUtils.waitForSpinnerToDisappear(this.page);
  }

  async enterAccountName(accountName: string): Promise<void> {
    await this.perform("fill", "Account Name", accountName);
  }

  async save(): Promise<void> {
    await this.perform("click", "Save");
    await SalesforceWaitUtils.waitForSpinnerToDisappear(this.page);
    await SalesforceWaitUtils.waitForToastToAppear(this.page);
  }
}
