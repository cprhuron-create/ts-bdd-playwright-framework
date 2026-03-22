import fs from "fs";
import path from "path";
import { logger } from "../utils/Logger";

type LocatorMemoryEntry = {
  locator: string;
  confidence: number;
  lastUsed: string;
};

type LocatorMemoryMap = Record<string, LocatorMemoryEntry>;

export class LocatorMemoryService {
  private static memoryFile = path.resolve("src/core/ai/healed-locators.json");

  private static ensureFile(): void {
    const dir = path.dirname(this.memoryFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.memoryFile)) fs.writeFileSync(this.memoryFile, JSON.stringify({}, null, 2), "utf-8");
  }

  static readAll(): LocatorMemoryMap {
    this.ensureFile();
    try {
      return JSON.parse(fs.readFileSync(this.memoryFile, "utf-8")) as LocatorMemoryMap;
    } catch {
      return {};
    }
  }

  static get(key: string): LocatorMemoryEntry | null {
    const memory = this.readAll();
    return memory[key] || null;
  }

  static save(key: string, locator: string, confidence: number): void {
    const memory = this.readAll();
    memory[key] = { locator, confidence, lastUsed: new Date().toISOString() };
    fs.writeFileSync(this.memoryFile, JSON.stringify(memory, null, 2), "utf-8");
    logger.info(`Saved healed locator for [${key}] with confidence ${confidence}`);
  }
}
