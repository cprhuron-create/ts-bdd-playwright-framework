import { Before, After, ITestCaseHookParameter, Status, setDefaultTimeout } from "@cucumber/cucumber";
import { frameworkConfig } from "../../config/framework.config";
import { BrowserManager } from "../core/driver/BrowserManager";
import { ContextManager } from "../core/driver/ContextManager";
import { ReportManager } from "../core/reporting/ReportManager";
import { ScreenshotManager } from "../core/reporting/ScreenshotManager";
import { Attachments } from "../core/reporting/Attachments";
import { CustomWorld } from "./world";

setDefaultTimeout(frameworkConfig.navigationTimeout);

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  ReportManager.ensureReportFolders();
  const page = await BrowserManager.launchBrowser();
  ContextManager.setPage(page);
  this.page = page;
  this.testName = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, "_");
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  try {
    if (scenario.result?.status === Status.FAILED && frameworkConfig.screenshotOnFail && this.page && !this.page.isClosed()) {
      const screenshotPath = await ScreenshotManager.capture(this.page, `${this.testName}_FAILED_${Date.now()}.png`);
      const base64 = await Attachments.toBase64(screenshotPath);
      await this.attach(base64, "image/png");
    }
    if (scenario.result?.status === Status.PASSED && frameworkConfig.screenshotOnPass && this.page && !this.page.isClosed()) {
      const screenshotPath = await ScreenshotManager.capture(this.page, `${this.testName}_PASSED_${Date.now()}.png`);
      const base64 = await Attachments.toBase64(screenshotPath);
      await this.attach(base64, "image/png");
    }
  } finally {
    await BrowserManager.closeBrowser();
  }
});
