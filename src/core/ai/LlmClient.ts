import axios from "axios";
import { frameworkConfig } from "../../../config/framework.config";
import { logger } from "../utils/Logger";

export class LlmClient {
  static async ask(prompt: string): Promise<string | null> {
    try {
      logger.info(`Sending LLM request: ${frameworkConfig.llm.provider} / ${frameworkConfig.llm.model}`);
      const response = await axios.post(
        frameworkConfig.llm.endpoint,
        { model: frameworkConfig.llm.model, prompt, stream: false },
        { timeout: frameworkConfig.llm.timeoutMs, headers: { "Content-Type": "application/json" } }
      );
      const raw = typeof response.data?.response === "string" ? response.data.response : JSON.stringify(response.data);
      return raw.trim().replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
    } catch (error) {
      logger.warn(`LLM request failed: ${(error as Error).message}`);
      return null;
    }
  }

  static async askForLocator(prompt: string): Promise<string | null> {
    const cleaned = await this.ask(prompt);
    if (!cleaned) return null;
    const suggested = cleaned.match(/(getByRole\([^)]+\)|getByLabel\([^)]+\)|getByText\([^)]+\)|css=.*|xpath=.*)/i)?.[0] || null;
    if (!suggested) {
      logger.warn(`LLM returned no usable locator. Raw response: ${cleaned}`);
      return null;
    }
    logger.info(`LLM suggested locator: ${suggested}`);
    return suggested;
  }
}
