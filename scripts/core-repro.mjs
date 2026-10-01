import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { renderToString } from '../packages/stencil-lib/hydrate/index.mjs';

const { html } = await renderToString(
  '<slot-parent><scoped-child></scoped-child> trailing text</slot-parent>',
  { fullDocument: false, prettyHtml: false, serializeShadowRoot: 'scoped' },
);

createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost:3001').pathname;
  if (/^\/components\/[\w-]+\.js$/.test(pathname)) {
    try {
      const file = new URL(`../packages/stencil-lib/dist${pathname}`, import.meta.url);
      const content = await readFile(file);
      response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      response.end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
    return;
  }
  if (pathname !== '/' && pathname !== '/parent-first') {
    response.writeHead(404).end('Not found');
    return;
  }
  const parentFirst = pathname === '/parent-first';
  const definitions = parentFirst ? 'defineParent(); defineChild();' : 'defineChild(); defineParent();';
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(`<!doctype html><html lang="en"><meta charset="utf-8">
<title>Stencil scoped hydration order</title><body>
<h1>Stencil scoped hydration order</h1>
<p>Registration order: ${parentFirst ? 'parent first' : 'child first'}.</p>
<nav><a href="/">Child first</a> | <a href="/parent-first">Parent first diagnostic</a></nav>
<p>Expected: Child content followed by a space and trailing text.</p>
${html}
<pre id="result"></pre>
<script type="module">
import { defineCustomElement as defineChild } from '/components/scoped-child.js';
import { defineCustomElement as defineParent } from '/components/slot-parent.js';
${definitions}
const parent = document.querySelector('slot-parent');
document.querySelector('#result').textContent = JSON.stringify(
  Array.from(parent.childNodes, node => node.nodeType === Node.TEXT_NODE
    ? { text: node.textContent } : { element: node.localName }), null, 2);
</script></body></html>`);
}).listen(3001, '127.0.0.1', () => {
  console.log('Raw Stencil control: http://localhost:3001/');
});
