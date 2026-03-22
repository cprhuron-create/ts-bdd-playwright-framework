import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";

export class ScreenshotManager {
  static async capture(page: Page, filename: string): Promise<string> {
    const dir = path.resolve("reports/screenshots");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }
}
