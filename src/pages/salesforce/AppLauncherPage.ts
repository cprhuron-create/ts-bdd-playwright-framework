import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/BasePage";
import { SalesforceWaitUtils } from "../../core/utils/SalesforceWaitUtils";

export class AppLauncherPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openAppLauncher(): Promise<void> {
    await this.perform("click", "App Launcher");
    await SalesforceWaitUtils.waitForSpinnerToDisappear(this.page);
  }

  async searchApp(appName: string): Promise<void> {
    await this.perform("fill", "Search apps and items", appName);
  }

  async openApp(appName: string): Promise<void> {
    await this.perform("click", appName);
    await SalesforceWaitUtils.waitForSpinnerToDisappear(this.page);
  }
}
