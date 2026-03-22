import { LlmClient } from "../ai/LlmClient";

export class AiReportService {
  static async summarizeFailure(errorMessage: string): Promise<string> {
    const prompt = `You are an automation test failure analyst.

Analyze this failure and return:
- probable root cause
- likely impacted locator or action
- suggested fix

Keep it short and clear.
Failure:
${errorMessage}`.trim();
    const result = await LlmClient.ask(prompt);
    return result || "AI summary unavailable.";
  }
}
