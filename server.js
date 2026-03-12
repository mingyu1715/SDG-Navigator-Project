const http = require("http");
const path = require("path");

const { sendJson, sendFile, parseBody } = require("./lib/httpUtils");
const { handleSdgRoutes } = require("./routes/sdgRoutes");
const sdgServices = require("./services/sdg");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  const handled = await handleSdgRoutes(req, res, url, {
    sdgServices,
    sendJson,
    parseBody
  });

  if (handled) {
    return;
  }

  const safePath = path.normalize(pathname);
  let staticPath = safePath;

  if (safePath === "/") {
    staticPath = "/index.html";
  } else if (pathname.endsWith("/") || !path.extname(safePath)) {
    staticPath = path.join(safePath, "index.html");
  }

  let filePath = path.join(PUBLIC_DIR, staticPath);

  if (pathname === "/sdg") {
    filePath = path.join(PUBLIC_DIR, "sdg.html");
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
