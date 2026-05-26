const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT_DIR = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function resolveRequestPath(urlPath) {
  let pathname = "/";
  try {
    pathname = new URL(urlPath, "http://localhost").pathname;
  } catch {
    pathname = "/";
  }

  let decodedPath = "/";
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    decodedPath = "/";
  }

  const normalized = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = path.join(ROOT_DIR, normalized);
  if (!absolutePath.startsWith(ROOT_DIR)) {
    return path.join(ROOT_DIR, "index.html");
  }
  return absolutePath;
}

function sendFile(res, filePath, statusCode = 200) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(statusCode, {
      "cache-control": "no-store",
      "content-type": MIME_TYPES[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

function handleRequest(req, res) {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
    return;
  }

  const requestPath = resolveRequestPath(req.url);
  const fallbackPath = path.join(ROOT_DIR, "index.html");

  fs.stat(requestPath, (error, stat) => {
    if (!error && stat.isDirectory()) {
      sendFile(res, path.join(requestPath, "index.html"));
      return;
    }

    if (!error && stat.isFile()) {
      sendFile(res, requestPath);
      return;
    }

    const hasExtension = Boolean(path.extname(requestPath));
    if (hasExtension) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    sendFile(res, fallbackPath);
  });
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
