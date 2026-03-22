export class SalesforceUtils {
  static appendSecurityToken(password: string, token?: string): string {
    return token ? `${password}${token}` : password;
  }

  static normalizeLightningPath(path: string): string {
    return path.startsWith("/lightning") ? path : `/lightning${path}`;
  }

  static isLightningPage(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes("/lightning") || lower.includes("lightning.force.com");
  }

  static isSalesforceDomain(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes("salesforce.com") || lower.includes("force.com");
  }

  static isSSOPage(url: string): boolean {
    const lower = url.toLowerCase();
    return lower.includes("okta") || lower.includes("auth") || lower.includes("oauth") || lower.includes("login.microsoftonline");
  }

  static isLoggedIn(url: string): boolean {
    return this.isLightningPage(url) || this.isSSOPage(url);
  }
}
