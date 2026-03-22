import { Locator, Page } from "@playwright/test";
import { frameworkConfig } from "../../../config/framework.config";
import { LocatorRecoveryService } from "./LocatorRecoveryService";
import { LocatorMemoryService } from "./LocatorMemoryService";
import { logger } from "../utils/Logger";

export class SelfHealingEngine {
  static async getFallbackLocator(page: Page, elementName: string, action: string = "unknown"): Promise<Locator | null> {
    if (!frameworkConfig.aiHealing) {
      logger.info(`AI healing disabled. Skipping self-healing for: ${elementName}`);
      return null;
    }

    const pageKey = `${page.url().split("?")[0]}::${elementName}`;
    const savedEntry = LocatorMemoryService.get(pageKey);
    if (savedEntry && savedEntry.confidence >= 0.7) {
      logger.info(`Trying saved healed locator for [${pageKey}]: ${savedEntry.locator}`);
      const built = await this.buildLocator(page, savedEntry.locator);
      if (built) return built;
      logger.warn(`Saved locator memory exists but could not be used for [${pageKey}]`);
    }

    logger.warn(`Attempting self-healing for element: ${elementName}, action: ${action}`);
    const recovered = await LocatorRecoveryService.recover(page, elementName);
    if (!recovered) {
      logger.warn(`No recovered locator found for: ${elementName}`);
      return null;
    }
    logger.info(`Recovered locator candidate for ${elementName}: ${recovered}`);
    const built = await this.buildLocator(page, recovered);
    if (built) {
      LocatorMemoryService.save(pageKey, recovered, 0.9);
      return built;
    }
    return null;
  }

  private static async buildLocator(page: Page, recovered: string): Promise<Locator | null> {
    try {
      if (recovered.startsWith("css=")) {
        const locator = page.locator(recovered.replace(/^css=/, ""));
        return (await locator.count()) > 0 ? locator.first() : null;
      }
      if (recovered.startsWith("xpath=")) {
        const locator = page.locator(recovered);
        return (await locator.count()) > 0 ? locator.first() : null;
      }
      if (recovered.startsWith("getByText(")) {
        const text = recovered.match(/getByText\(['"`](.+?)['"`]\)/)?.[1];
        if (!text) return null;
        const locator = page.getByText(text, { exact: false });
        return (await locator.count()) > 0 ? locator.first() : null;
      }
      if (recovered.startsWith("getByLabel(")) {
        const text = recovered.match(/getByLabel\(['"`](.+?)['"`]\)/)?.[1];
        if (!text) return null;
        const locator = page.getByLabel(text, { exact: false });
        return (await locator.count()) > 0 ? locator.first() : null;
      }
      if (recovered.startsWith("getByRole(")) {
        const roleMatch = recovered.match(/getByRole\(['"`](.+?)['"`],\s*\{\s*name:\s*['"`](.+?)['"`]\s*\}\)/);
        if (!roleMatch) return null;
        const role = roleMatch[1] as any;
        const name = roleMatch[2];
        const locator = page.getByRole(role, { name, exact: false });
        return (await locator.count()) > 0 ? locator.first() : null;
      }
      logger.info(`Unhandled recovered locator format: ${recovered}`);
      return null;
    } catch {
      return null;
    }
  }
}
