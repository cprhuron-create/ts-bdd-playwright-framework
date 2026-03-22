module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["src/**/*.ts"],
    format: [
      "progress",
      "summary",
      "json:reports/json/cucumber-report.json"
    ],
    publishQuiet: true
  }
};
