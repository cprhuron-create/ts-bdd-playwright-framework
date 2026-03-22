import { Locator } from "@playwright/test";

export class HighlightUtils {
  static async highlight(locator: Locator): Promise<void> {
    try {
      await locator.first().evaluate((el) => {
        const original = (el as HTMLElement).style.outline;
        (el as HTMLElement).style.outline = "2px solid red";
        setTimeout(() => {
          (el as HTMLElement).style.outline = original;
        }, 500);
      });
    } catch {
      // no-op
    }
  }
}
