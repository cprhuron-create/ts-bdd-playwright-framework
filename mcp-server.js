const http = require("http");

const server = http.createServer((req, res) => {
  const sendJson = (payload) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  };

  if (req.url === "/health") return sendJson({ status: "ok", message: "MCP server running" });
  if (req.url === "/url") return sendJson({ url: "Not connected to browser context yet" });
  if (req.url === "/title") return sendJson({ title: "Not connected to browser context yet" });
  if (req.url === "/dom") return sendJson({ dom: "Not connected to browser context yet" });
  return sendJson({ status: "ok", message: "MCP server running" });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
});
