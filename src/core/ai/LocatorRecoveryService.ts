import { Page } from "@playwright/test";
import { DomSnapshotService } from "./DomSnapshotService";
import { LlmClient } from "./LlmClient";
import { logger } from "../utils/Logger";

export class LocatorRecoveryService {
  static async recover(page: Page, elementName: string): Promise<string | null> {
    try {
      const domSnippet = await DomSnapshotService.capture(page);
      const pageUrl = page.url();
      const pageTitle = await page.title().catch(() => "unknown");
      const prompt = `You are a Playwright locator recovery assistant.

Target element description:
${elementName}

Current page URL:
${pageUrl}

Current page title:
${pageTitle}

Task:
Given the DOM snippet below, return exactly ONE best Playwright locator for the target element.

Rules:
- Prefer in this order:
  1. getByRole('role', { name: 'text' })
  2. getByLabel('text')
  3. getByText('text')
  4. css=...
  5. xpath=...
- Return ONLY the locator string.
- Do not explain anything.
- Do not return code fences.
- Do not return multiple options.
- Use a stable human-readable locator if possible.

DOM snippet:
${domSnippet}`.trim();
      const locatorSuggestion = await LlmClient.askForLocator(prompt);
      if (!locatorSuggestion) {
        logger.warn(`No locator suggestion returned for [${elementName}]`);
        return null;
      }
      const cleaned = locatorSuggestion.trim().replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
      logger.info(`Recovered locator for [${elementName}]: ${cleaned}`);
      return cleaned || null;
    } catch (error) {
      logger.warn(`Locator recovery failed for [${elementName}]: ${(error as Error).message}`);
      return null;
    }
  }
}
