import './build.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const qa = process.argv.includes('--qa');
const port = Number(process.env.PORT || (qa ? 4174 : 4173));
const qaFiles = new Map([
  ['/__qa','scripts/browser-qa/index.html'], ['/__qa/acceptance.mjs','scripts/browser-qa/acceptance.mjs']
]);
const types = { '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.html':'text/html', '.svg':'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url,'http://localhost').pathname;
    const path = resolve(root, '.' + decodeURIComponent(urlPath));
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const file = qa && qaFiles.has(urlPath) ? resolve(qaFiles.get(urlPath)) : path === root ? resolve(root, 'index.html') : path;
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': (types[extname(file)] || 'application/octet-stream') + '; charset=utf-8' }).end(content);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('File unavailable');
  }
}).listen(port,'127.0.0.1',()=>console.log('Malta Learningverse: http://127.0.0.1:'+port+(qa?'/__qa':'')));
