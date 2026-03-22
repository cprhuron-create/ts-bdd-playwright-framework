import { Page } from "@playwright/test";

export class SalesforceWaitUtils {
  static async waitForLightningReady(page: Page): Promise<void> {
    await page.waitForLoadState("domcontentloaded", { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  static async waitForSpinnerToDisappear(page: Page): Promise<void> {
    const spinner = page.locator('[role="progressbar"], .slds-spinner, .spinner, lightning-spinner');
    await spinner.first().waitFor({ state: "hidden", timeout: 15000 }).catch(() => {});
  }

  static async waitForToastToAppear(page: Page): Promise<void> {
    const toast = page.locator('.toastMessage, .slds-notify_toast, [role="alert"], .forceActionsText');
    await toast.first().waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  }
}
