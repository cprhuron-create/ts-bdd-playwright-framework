import { IWorldOptions, World } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { RegressionPage } from "../pages/salesforce/RegressionPage";

export class CustomWorld extends World {
  page!: Page;
  testName!: string;
  regressionPage!: RegressionPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}
