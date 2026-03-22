# BDD Playwright Framework

## Setup

1. Extract and open in VS Code.
2. Install dependencies:
   - `npm install`
   - `npm run pw:install`
3. Create env file:
   - macOS/Linux: `cp .env.example .env`
   - Windows PowerShell: `Copy-Item .env.example .env`
4. Start Ollama and pull a model:
   - `ollama serve`
   - `ollama pull llama3`
5. Start MCP server:
   - `npm run mcp:start`
6. First-time auth capture:
   - `npm run auth:setup`
7. Run tests:
   - `npm run test:login`
   - `npm run test:regression`
8. Generate dashboard:
   - `npm run report:dashboard`
   - macOS: `npm run report:open:mac`
   - Windows: `npm run report:open:win`

## Notes
- `storage/auth-state.json` is reused automatically when present.
- `src/core/ai/healed-locators.json` stores successful healed locators.
- AI healing is wired through `BaseActions`.
- MCP server is a starter with `/health`, `/url`, `/title`, `/dom` endpoints.
