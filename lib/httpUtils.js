const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { pipeline } = require("stream");

const COMPRESS_THRESHOLD_BYTES = 1024;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function toContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon"
  }[ext] || "application/octet-stream";
}

function toCacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") {
    // Keep app shell fresh while still allowing browser revalidation.
    return "no-cache";
  }
  return "public, max-age=3600, must-revalidate";
}

function toWeakEtag(stat) {
  return `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
}

function isCompressibleContentType(contentType) {
  if (!contentType) return false;
  return (
    contentType.startsWith("text/") ||
    contentType.startsWith("application/javascript") ||
    contentType.startsWith("application/json") ||
    contentType.startsWith("image/svg+xml")
  );
}

function parseEncodingQ(token) {
  const parts = token.split(";");
  const encoding = (parts[0] || "").trim().toLowerCase();
  let q = 1;

  for (let i = 1; i < parts.length; i += 1) {
    const [k, v] = parts[i].split("=");
    if (String(k || "").trim().toLowerCase() === "q") {
      const parsed = Number(v);
      if (Number.isFinite(parsed)) {
        q = Math.max(0, Math.min(1, parsed));
      }
      break;
    }
  }

  return { encoding, q };
}

function pickContentEncoding(acceptEncodingHeader) {
  if (!acceptEncodingHeader) return null;

  const map = new Map();
  acceptEncodingHeader.split(",").forEach((token) => {
    const { encoding, q } = parseEncodingQ(token);
    if (!encoding) return;
    map.set(encoding, q);
  });

  const wildcardQ = map.has("*") ? map.get("*") : 0;
  const brQ = map.has("br") ? map.get("br") : wildcardQ;
  const gzipQ = map.has("gzip") ? map.get("gzip") : wildcardQ;

  if (brQ > 0) return "br";
  if (gzipQ > 0) return "gzip";
  return null;
}

function shouldCompress(req, contentType, stat) {
  if (!isCompressibleContentType(contentType)) return false;
  if (!stat || stat.size < COMPRESS_THRESHOLD_BYTES) return false;
  if (req.method === "HEAD") return false;
  return true;
}

function createEncodingStream(encoding) {
  if (encoding === "br") {
    return zlib.createBrotliCompress({
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 5
      }
    });
  }
  if (encoding === "gzip") {
    return zlib.createGzip({ level: 6 });
  }
  return null;
}

function sendFile(req, res, filePath) {
  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    const contentType = toContentType(filePath);
    const cacheControl = toCacheControl(filePath);
    const encoding = shouldCompress(req, contentType, stat)
      ? pickContentEncoding(req.headers["accept-encoding"])
      : null;
    const etag = toWeakEtag(stat);
    const lastModified = stat.mtime.toUTCString();
    const ifNoneMatch = req.headers["if-none-match"];
    const ifModifiedSince = req.headers["if-modified-since"];
    const isNotModifiedByEtag = ifNoneMatch && ifNoneMatch === etag;
    const isNotModifiedByDate = ifModifiedSince && (new Date(ifModifiedSince).getTime() >= stat.mtime.getTime());

    if (isNotModifiedByEtag || isNotModifiedByDate) {
      const notModifiedHeaders = {
        ETag: etag,
        "Last-Modified": lastModified,
        "Cache-Control": cacheControl,
        Vary: "Accept-Encoding"
      };
      if (encoding) {
        notModifiedHeaders["Content-Encoding"] = encoding;
      }
      res.writeHead(304, notModifiedHeaders);
      res.end();
      return;
    }

    const headers = {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
      ETag: etag,
      "Last-Modified": lastModified,
      Vary: "Accept-Encoding"
    };
    if (encoding) {
      headers["Content-Encoding"] = encoding;
    }

    res.writeHead(200, headers);

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    const onPipeError = () => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      sendJson(res, 404, { error: "Not found" });
    };

    stream.on("error", onPipeError);

    if (!encoding) {
      stream.pipe(res);
      return;
    }

    const encoder = createEncodingStream(encoding);
    if (!encoder) {
      stream.pipe(res);
      return;
    }

    pipeline(stream, encoder, res, (err) => {
      if (err) {
        onPipeError();
      }
    });
  });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

module.exports = {
  sendJson,
  sendFile,
  parseBody
};
