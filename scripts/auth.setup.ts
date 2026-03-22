// import "dotenv/config";
// import { chromium } from "@playwright/test";
// import fs from "fs";
// import path from "path";

// async function globalAuth() {
//   const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--start-maximized"] });
//   const context = await browser.newContext({ viewport: null });
//   const page = await context.newPage();
//   const baseUrl = process.env.BASE_URL;
//   if (!baseUrl) throw new Error("BASE_URL is missing in .env");

//   await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
//   await page.waitForTimeout(2000);

//   const currentUrl = page.url().toLowerCase();
//   const alreadyAuthenticated = currentUrl.includes("lightning") || currentUrl.includes("salesforce.com/home") || currentUrl.includes("/lightning");

//   if (!alreadyAuthenticated) {
//     const ssoButton = page.getByRole("button", { name: /log in with/i });
//     const ssoLink = page.getByRole("link", { name: /log in with/i });
//     const ssoText = page.getByText(/log in with/i);

//     if (await ssoButton.first().isVisible().catch(() => false)) await ssoButton.first().click();
//     else if (await ssoLink.first().isVisible().catch(() => false)) await ssoLink.first().click();
//     else if (await ssoText.first().isVisible().catch(() => false)) await ssoText.first().click();
//   }

//   console.log("Complete authentication manually in the opened browser...");
//   await page.waitForURL(/lightning|salesforce|okta|auth|oauth|login\.microsoftonline/i, { timeout: 300000 });

//   const storageDir = path.resolve("storage");
//   if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
//   const authFile = path.resolve("storage/auth-state.json");
//   await context.storageState({ path: authFile });
//   console.log(`Auth state saved to ${authFile}`);
//   await browser.close();
// }

// globalAuth().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
import "dotenv/config";
import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

async function globalAuth() {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false,
    args: ["--start-maximized"],
  });

  const context = await browser.newContext({
    viewport: null,
  });

  const page = await context.newPage();

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error("BASE_URL is missing in .env");
  }

  await page.goto(baseUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(3000);

  const currentUrl = page.url().toLowerCase();
  const alreadyAuthenticated =
    currentUrl.includes("lightning") ||
    currentUrl.includes("salesforce.com/home") ||
    currentUrl.includes("/lightning");

  if (!alreadyAuthenticated) {
    const ssoButton = page.getByRole("button", { name: /log in with/i });
    const ssoLink = page.getByRole("link", { name: /log in with/i });
    const ssoText = page.getByText(/log in with/i);

    if (
      await ssoButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await ssoButton.first().click();
    } else if (
      await ssoLink
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await ssoLink.first().click();
    } else if (
      await ssoText
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await ssoText.first().click();
    }
  }

  console.log("Complete authentication manually in the browser.");
  console.log("Waiting until Salesforce Lightning home page is reached...");

  await page.waitForURL(/lightning|lightning\/page\/home/i, {
    timeout: 300000,
  });

  await page.waitForTimeout(5000);

  const finalUrl = page.url();
  console.log("Final authenticated URL:", finalUrl);

  const storageDir = path.resolve("storage");
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const authFile = path.resolve("storage/auth-state.json");
  await context.storageState({ path: authFile });

  console.log(`Auth state saved to ${authFile}`);
  await browser.close();
}

globalAuth().catch((err) => {
  console.error(err);
  process.exit(1);
});
