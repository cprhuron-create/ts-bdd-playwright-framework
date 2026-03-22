import { Locator, Page } from "@playwright/test";

export class WaitUtils {
  static async waitForVisible(locator: Locator): Promise<void> {
    await locator.first().waitFor({ state: "visible", timeout: 15000 });
  }

  static async waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState("domcontentloaded", { timeout: 60000 }).catch(() => {});
  }
}
