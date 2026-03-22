import { Locator, Page } from "@playwright/test";
import { HighlightUtils } from "../utils/HighlightUtils";
import { WaitUtils } from "../utils/WaitUtils";
import { SelfHealingEngine } from "../ai/SelfHealingEngine";
import { logger } from "../utils/Logger";

export class BaseActions {
  constructor(protected readonly page: Page) {}

  async click(locator: Locator, elementName = "element"): Promise<void> {
    try {
      await WaitUtils.waitForVisible(locator);
      await HighlightUtils.highlight(locator);
      await locator.first().click({ timeout: 10000 });
      logger.info(`Clicked: ${elementName}`);
    } catch (error) {
      logger.warn(`Primary click failed for ${elementName}. Trying self-healing.`);
      const healed = await SelfHealingEngine.getFallbackLocator(this.page, elementName, "click");
      if (!healed) {
        logger.error(`Self-healing failed for click on: ${elementName}`);
        throw error;
      }
      await WaitUtils.waitForVisible(healed);
      await HighlightUtils.highlight(healed);
      await healed.first().click({ timeout: 10000 });
      logger.info(`Clicked via healed locator: ${elementName}`);
    }
  }

  async fill(locator: Locator, value: string, elementName = "element"): Promise<void> {
    try {
      await WaitUtils.waitForVisible(locator);
      await HighlightUtils.highlight(locator);
      await locator.first().fill(value, { timeout: 10000 });
      logger.info(`Filled: ${elementName}`);
    } catch (error) {
      logger.warn(`Primary fill failed for ${elementName}. Trying self-healing.`);
      const healed = await SelfHealingEngine.getFallbackLocator(this.page, elementName, "fill");
      if (!healed) {
        logger.error(`Self-healing failed for fill on: ${elementName}`);
        throw error;
      }
      await WaitUtils.waitForVisible(healed);
      await HighlightUtils.highlight(healed);
      await healed.first().fill(value, { timeout: 10000 });
      logger.info(`Filled via healed locator: ${elementName}`);
    }
  }
}
