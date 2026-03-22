import fs from "fs";

export class Attachments {
  static async toBase64(filePath: string): Promise<string> {
    return fs.readFileSync(filePath).toString("base64");
  }
}
