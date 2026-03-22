import { frameworkConfig } from "./framework.config";

export const browserConfig = {
  browserName: frameworkConfig.browser,
  headless: frameworkConfig.headless,
  slowMo: frameworkConfig.slowMo,
  maximizeWindow: frameworkConfig.maximizeWindow
};
