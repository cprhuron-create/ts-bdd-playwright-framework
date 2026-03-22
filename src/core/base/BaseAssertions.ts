import { expect, Locator, Page } from "@playwright/test";

export class BaseAssertions {
  constructor(private readonly page: Page) {}

  async toBeVisible(locator: Locator): Promise<void> {
    await expect(locator.first()).toBeVisible();
  }

  async urlContains(part: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(part, "i"));
  }
}
