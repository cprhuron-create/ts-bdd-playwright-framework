const fs = require("fs");
const path = require("path");

const authFile = path.resolve("storage/auth-state.json");
if (fs.existsSync(authFile)) {
  fs.rmSync(authFile, { force: true });
  console.log(`Deleted ${authFile}`);
} else {
  console.log("No auth-state.json file found.");
}
