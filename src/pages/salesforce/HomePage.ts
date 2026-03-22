import { Page } from "@playwright/test";
import { BasePage } from "../../core/base/BasePage";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickButton(buttonName: string): Promise<void> {
    await this.perform("click", buttonName);
  }

  async clickTab(tabName: string): Promise<void> {
    await this.perform("click", tabName);
  }

  async fillField(fieldName: string, value: string): Promise<void> {
    await this.perform("fill", fieldName, value);
  }
}
