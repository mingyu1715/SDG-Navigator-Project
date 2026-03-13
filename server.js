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
  const hasExt = Boolean(path.extname(safePath));
  let filePath = path.join(PUBLIC_DIR, safePath === "/" ? "/index.html" : safePath);

  if (!hasExt) {
    // SPA fallback: all route paths are resolved by the single app shell.
    filePath = path.join(PUBLIC_DIR, "/index.html");
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
