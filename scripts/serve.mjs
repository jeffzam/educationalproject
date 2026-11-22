import './build.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const types = { '.js':'text/javascript', '.css':'text/css', '.html':'text/html', '.svg':'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const file = path === root ? resolve(root, 'index.html') : path;
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': (types[extname(file)] || 'application/octet-stream') + '; charset=utf-8' }).end(content);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('File unavailable');
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Malta Learningverse is ready on localhost'));
