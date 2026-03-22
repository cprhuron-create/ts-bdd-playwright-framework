import { env } from "./env";

export const frameworkConfig = {
  baseUrl: env.BASE_URL,
  browser: env.BROWSER.toLowerCase(),
  headless: env.HEADLESS.toLowerCase() === "true",
  slowMo: Number(env.SLOW_MO || 0),
  defaultTimeout: Number(env.DEFAULT_TIMEOUT || 60000),
  navigationTimeout: Number(env.NAVIGATION_TIMEOUT || 90000),
  screenshotOnFail: env.SCREENSHOT_ON_FAIL.toLowerCase() === "true",
  screenshotOnPass: env.SCREENSHOT_ON_PASS.toLowerCase() === "true",
  aiHealing: env.AI_HEALING.toLowerCase() === "true",
  maximizeWindow: env.MAXIMIZE_WINDOW.toLowerCase() === "true",
  llm: {
    provider: env.LLM_PROVIDER,
    model: env.LLM_MODEL,
    endpoint: env.LLM_ENDPOINT,
    timeoutMs: Number(env.LLM_TIMEOUT_MS || 30000)
  },
  mcp: {
    enabled: env.MCP_ENABLED.toLowerCase() === "true",
    endpoint: env.MCP_ENDPOINT
  }
};
