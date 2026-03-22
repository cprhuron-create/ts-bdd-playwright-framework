import fs from "fs";
import path from "path";
import { logger } from "../utils/Logger";

export class ReportManager {
  static ensureReportFolders(): void {
    ["reports", "reports/screenshots", "reports/json", "reports/dashboard"].forEach((dir) => {
      const resolved = path.resolve(dir);
      if (!fs.existsSync(resolved)) fs.mkdirSync(resolved, { recursive: true });
    });
    logger.info("Report folders initialized.");
  }
}
