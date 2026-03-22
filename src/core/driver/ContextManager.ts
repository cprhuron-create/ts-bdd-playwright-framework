import { Page } from "@playwright/test";

export class ContextManager {
  private static page: Page;

  static setPage(page: Page): void {
    this.page = page;
  }

  static getPage(): Page {
    return this.page;
  }
}
