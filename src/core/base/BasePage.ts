// import { Locator, Page } from "@playwright/test";
// import { BaseActions } from "./BaseActions";
// import { BaseAssertions } from "./BaseAssertions";
// import { WaitUtils } from "../utils/WaitUtils";

// export class BasePage {
//   protected readonly actions: BaseActions;
//   protected readonly assertions: BaseAssertions;

//   constructor(protected readonly page: Page) {
//     this.actions = new BaseActions(page);
//     this.assertions = new BaseAssertions(page);
//   }

//   async navigate(url: string): Promise<void> {
//     await this.page.goto(url, { waitUntil: "domcontentloaded" });
//     await WaitUtils.waitForPageLoad(this.page);
//   }

//   locator(selector: string): Locator {
//     return this.page.locator(selector);
//   }

//   async perform(action: "click" | "fill" | "type", elementName: string, value?: string): Promise<void> {
//     const locator = this.buildSmartLocator(elementName);
//     if (action === "click") {
//       await this.actions.click(locator, elementName);
//       return;
//     }
//     if (action === "fill" || action === "type") {
//       if (!value) throw new Error(`Value is required for ${action} action`);
//       await this.actions.fill(locator, value, elementName);
//     }
//   }

//   private buildSmartLocator(elementName: string): Locator {
//     return this.page.locator(
//       `text=${elementName}, input[placeholder*="${elementName}"], [aria-label*="${elementName}"], button:has-text("${elementName}"), a:has-text("${elementName}")`
//     );
//   }
// }
import { Locator, Page } from "@playwright/test";
import { BaseActions } from "./BaseActions";
import { BaseAssertions } from "./BaseAssertions";
import { WaitUtils } from "../utils/WaitUtils";

export class BasePage {
  protected readonly actions: BaseActions;
  protected readonly assertions: BaseAssertions;

  constructor(protected readonly page: Page) {
    this.actions = new BaseActions(page);
    this.assertions = new BaseAssertions(page);
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await WaitUtils.waitForPageLoad(this.page);
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async perform(
    action: "click" | "fill" | "type",
    elementName: string,
    value?: string,
  ): Promise<void> {
    const locator = this.buildSmartLocator(elementName);

    if (action === "click") {
      await this.actions.click(locator, elementName);
      return;
    }

    if (action === "fill" || action === "type") {
      if (!value) {
        throw new Error(`Value is required for ${action} action`);
      }
      await this.actions.fill(locator, value, elementName);
    }
  }

  private buildSmartLocator(elementName: string): Locator {
    const regex = new RegExp(elementName, "i");

    const button = this.page.getByRole("button", { name: regex });
    const link = this.page.getByRole("link", { name: regex });
    const label = this.page.getByLabel(regex);
    const placeholder = this.page.getByPlaceholder(regex);
    const text = this.page.getByText(regex);

    return button.or(link).or(label).or(placeholder).or(text).first();
  }
}
