import "dotenv/config";

export const env = {
  BASE_URL: process.env.BASE_URL || "",
  BROWSER: process.env.BROWSER || "chrome",
  HEADLESS: process.env.HEADLESS || "false",
  SLOW_MO: process.env.SLOW_MO || "0",
  DEFAULT_TIMEOUT: process.env.DEFAULT_TIMEOUT || "60000",
  NAVIGATION_TIMEOUT: process.env.NAVIGATION_TIMEOUT || "90000",
  SCREENSHOT_ON_FAIL: process.env.SCREENSHOT_ON_FAIL || "true",
  SCREENSHOT_ON_PASS: process.env.SCREENSHOT_ON_PASS || "false",
  AI_HEALING: process.env.AI_HEALING || "true",
  LLM_PROVIDER: process.env.LLM_PROVIDER || "ollama",
  LLM_MODEL: process.env.LLM_MODEL || "llama3",
  LLM_ENDPOINT: process.env.LLM_ENDPOINT || "http://localhost:11434/api/generate",
  LLM_TIMEOUT_MS: process.env.LLM_TIMEOUT_MS || "30000",
  MCP_ENABLED: process.env.MCP_ENABLED || "true",
  MCP_ENDPOINT: process.env.MCP_ENDPOINT || "http://localhost:3001",
  MAXIMIZE_WINDOW: process.env.MAXIMIZE_WINDOW || "true"
};
