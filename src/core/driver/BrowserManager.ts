import { Browser, BrowserContext, chromium, firefox, webkit, Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { browserConfig } from "../../../config/browser.config";
import { logger } from "../utils/Logger";

export class BrowserManager {
  private static browser: Browser | undefined;
  private static context: BrowserContext | undefined;
  private static page: Page | undefined;

  static async launchBrowser(): Promise<Page> {
    const browserName = browserConfig.browserName;
    const launchArgs = browserConfig.maximizeWindow ? ["--start-maximized"] : [];

    if (browserName === "chrome") {
      this.browser = await chromium.launch({ channel: "chrome", headless: browserConfig.headless, slowMo: browserConfig.slowMo, args: launchArgs });
    } else if (browserName === "chromium") {
      this.browser = await chromium.launch({ headless: browserConfig.headless, slowMo: browserConfig.slowMo, args: launchArgs });
    } else if (browserName === "firefox") {
      this.browser = await firefox.launch({ headless: browserConfig.headless, slowMo: browserConfig.slowMo });
    } else {
      this.browser = await webkit.launch({ headless: browserConfig.headless, slowMo: browserConfig.slowMo });
    }

    const authFile = path.resolve("storage/auth-state.json");
    this.context = await this.browser.newContext({
      viewport: browserConfig.maximizeWindow ? null : { width: 1600, height: 900 },
      storageState: fs.existsSync(authFile) ? authFile : undefined
    });
    this.page = await this.context.newPage();
    logger.info(`Launched browser: ${browserName}`);
    return this.page;
  }

  static async closeBrowser(): Promise<void> {
    try {
      if (this.page && !this.page.isClosed()) await this.page.close().catch(() => undefined);
      if (this.context) await this.context.close().catch(() => undefined);
      if (this.browser) await this.browser.close().catch(() => undefined);
      logger.info("Browser closed.");
    } finally {
      this.page = undefined;
      this.context = undefined;
      this.browser = undefined;
    }
  }
}
