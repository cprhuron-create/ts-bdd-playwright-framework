import fs from "fs";
import path from "path";
import { AiReportService } from "../src/core/reporting/AiReportService";

const screenshotsDir = path.resolve("reports/screenshots");
const dashboardDir = path.resolve("reports/dashboard");
const jsonReportPath = path.resolve("reports/json/cucumber-report.json");
if (!fs.existsSync(dashboardDir)) fs.mkdirSync(dashboardDir, { recursive: true });
const screenshots = fs.existsSync(screenshotsDir) ? fs.readdirSync(screenshotsDir).filter((f) => f.endsWith(".png")) : [];
let cucumberJson: any[] = [];
if (fs.existsSync(jsonReportPath)) {
  try { cucumberJson = JSON.parse(fs.readFileSync(jsonReportPath, "utf-8")); } catch { cucumberJson = []; }
}
function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function getScenarioStatus(scenario: any): "passed" | "failed" | "skipped" {
  const steps = scenario.steps || [];
  if (steps.some((s: any) => s.result?.status === "failed")) return "failed";
  if (steps.every((s: any) => s.result?.status === "passed")) return "passed";
  return "skipped";
}
async function buildScenarioHtml(featureName: string, scenario: any, index: number): Promise<string> {
  const status = getScenarioStatus(scenario);
  const isOpen = status === "failed" ? "open" : "";
  const steps = scenario.steps || [];
  const relatedScreenshots = screenshots.filter((file) => file.toLowerCase().includes(scenario.name.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()));
  const failedStep = steps.find((s: any) => s.result?.status === "failed");
  const aiSummary = failedStep?.result?.error_message ? await AiReportService.summarizeFailure(failedStep.result.error_message) : "";
  const stepsHtml = steps.map((step: any) => {
    const stepStatus = step.result?.status || "unknown";
    return `<div class="step ${stepStatus}"><div class="step-head"><span class="step-keyword">${escapeHtml(step.keyword || "")}</span><span class="step-name">${escapeHtml(step.name || "")}</span><span class="step-status badge ${stepStatus}">${stepStatus.toUpperCase()}</span></div>${step.result?.error_message ? `<pre class="error-box">${escapeHtml(step.result.error_message)}</pre>` : ""}</div>`;
  }).join("");
  const screenshotsHtml = relatedScreenshots.length ? `<div class="screenshots">${relatedScreenshots.map((file) => `<div class="shot-card"><a href="../screenshots/${file}" target="_blank"><img src="../screenshots/${file}" alt="${escapeHtml(file)}" /></a><div class="shot-name">${escapeHtml(file)}</div></div>`).join("")}</div>` : `<div class="no-shot">No screenshots attached for this scenario.</div>`;
  const aiHtml = aiSummary && status === "failed" ? `<div class="section-title">AI Failure Summary</div><div class="ai-box">${escapeHtml(aiSummary)}</div>` : "";
  return `<details class="scenario ${status}" ${isOpen}><summary><div class="summary-left"><span class="feature-name">${escapeHtml(featureName)}</span><span class="scenario-name">${escapeHtml(scenario.name || `Scenario ${index + 1}`)}</span></div><span class="badge ${status}">${status.toUpperCase()}</span></summary><div class="scenario-body">${aiHtml}<div class="section-title">Steps</div>${stepsHtml}<div class="section-title">Screenshots</div>${screenshotsHtml}</div></details>`;
}
async function main() {
  const scenarioHtmlParts: string[] = [];
  for (const feature of cucumberJson) {
    const featureName = feature.name || "Unnamed Feature";
    const scenarios = (feature.elements || []).filter((e: any) => e.type === "scenario");
    for (let i = 0; i < scenarios.length; i++) scenarioHtmlParts.push(await buildScenarioHtml(featureName, scenarios[i], i));
  }
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8" /><title>Automation Dashboard</title><style>body{margin:0;font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0}.container{max-width:1200px;margin:0 auto;padding:24px}.title{font-size:28px;font-weight:700;margin-bottom:20px}details.scenario{background:#111827;border:1px solid #1f2937;border-radius:16px;margin-bottom:16px}details summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:18px}details summary::-webkit-details-marker{display:none}.summary-left{display:flex;flex-direction:column;gap:6px}.feature-name{font-size:12px;color:#94a3b8}.scenario-name{font-size:18px;font-weight:600;color:#f8fafc}.scenario-body{padding:0 18px 18px 18px}.section-title{margin:12px 0 10px;font-size:14px;color:#cbd5e1;font-weight:700}.step{border:1px solid #1f2937;border-radius:12px;padding:12px;margin-bottom:10px;background:#0b1220}.step-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.step-keyword{color:#93c5fd;font-weight:700}.step-name{color:#e5e7eb;flex:1}.badge{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:700;min-width:70px}.badge.passed{background:#14532d;color:#dcfce7}.badge.failed{background:#7f1d1d;color:#fee2e2}.badge.skipped{background:#3f3f46;color:#e4e4e7}.screenshots{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:10px}.shot-card{background:#0b1220;border:1px solid #1f2937;border-radius:12px;padding:10px}.shot-card img{width:100%;border-radius:8px;display:block}.shot-name{margin-top:8px;font-size:12px;color:#94a3b8;word-break:break-word}.error-box{margin-top:10px;white-space:pre-wrap;background:#1e293b;border-radius:10px;padding:10px;color:#fecaca;font-size:12px;overflow-x:auto}.ai-box{background:#172554;border:1px solid #1d4ed8;padding:12px;border-radius:12px;color:#dbeafe;white-space:pre-wrap}.no-shot{color:#94a3b8;font-size:13px;padding:8px 0}</style></head><body><div class="container"><div class="title">Automation Dashboard</div>${scenarioHtmlParts.join("") || "<div>No scenario data found.</div>"}</div></body></html>`;
  fs.writeFileSync(path.join(dashboardDir, "index.html"), html, "utf-8");
  console.log("Advanced AI dashboard report generated at reports/dashboard/index.html");
}
main();
