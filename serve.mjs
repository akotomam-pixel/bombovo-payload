import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const PORT = 3001; // 3000 is used by Next.js dev server

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];

  let filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  // If path is a directory, try index.html inside it
  const tryPaths = [filePath, path.join(filePath, "index.html")];

  const tryNext = (paths) => {
    if (!paths.length) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end(`Not found: ${urlPath}`);
    }
    const candidate = paths[0];
    fs.readFile(candidate, (err, data) => {
      if (err) return tryNext(paths.slice(1));
      const ext = path.extname(candidate).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    });
  };

  tryNext(tryPaths);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
});
