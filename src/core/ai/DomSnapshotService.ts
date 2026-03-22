import { Page } from "@playwright/test";

export class DomSnapshotService {
  static async capture(page: Page): Promise<string> {
    try {
      const snapshot = await page.evaluate(() => {
        const selectors = ["button", "a", "input", "textarea", "label", "[role]", "[aria-label]", "[data-testid]"];
        const elements: string[] = [];
        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => {
            const tag = el.tagName.toLowerCase();
            const text = el.textContent?.trim()?.slice(0, 100) || "";
            const aria = el.getAttribute("aria-label") || "";
            const role = el.getAttribute("role") || "";
            const id = (el as HTMLElement).id || "";
            const cls = ((el as HTMLElement).className || "").toString().slice(0, 100);
            if (text || aria || role) {
              elements.push(`<${tag} text="${text}" aria="${aria}" role="${role}" id="${id}" class="${cls}" />`);
            }
          });
        });
        return elements.join("\n");
      });
      return snapshot.length > 8000 ? snapshot.slice(0, 8000) : snapshot;
    } catch {
      const content = await page.content();
      return content.length > 8000 ? content.slice(0, 8000) : content;
    }
  }
}
