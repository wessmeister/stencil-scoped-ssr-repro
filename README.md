# Scoped SSR drops a nested component and adjacent text

Minimal reproduction for `@stencil/react-output-target` **1.6.2**, based on
[johnjenkins/stencil-starter-next](https://github.com/johnjenkins/stencil-starter-next/tree/8f84a23a6a32e94b02848ebbec149baedebc7e1f).
It retains the starter's three-package structure and uses Stencil **4.45.1**,
React **19.2.3**, and Next.js **15.5.9** (App Router).

## Run

Use Node.js 22 (tested with **22.23.1**) and pnpm **9.15.0**.

```sh
pnpm install --frozen-lockfile
pnpm start
```

Open http://localhost:3000/. The default page reproduces the failure.
To check a production build, stop the development server first, then run:

```sh
pnpm build
pnpm serve
```

## Expected and actual

The generated `/next` React wrappers render a parent component with a default
slot containing a generated child component and two adjacent text nodes:

```tsx
<SlotParent>
  <ScopedChild />{' '}trailing text
</SlotParent>
```

Both components use `shadow: true`. The React output target explicitly uses
`serializeShadowRoot: 'scoped'` to serialize their shadow roots as scoped markup.
The expected result is **Child content trailing text** in the bordered box.
Instead, the server-rendered `slot-parent` contains an empty slot: both the
`scoped-child` element and the adjacent text are missing. Inspect the HTML
response with `curl http://localhost:3000/` to see the omission before browser
hydration. There is no client-only rendering or app-level warning suppression.

For the output target's server diagnostic, start with
`STENCIL_SSR_DEBUG=1 pnpm start`. It reports a failure to serialize the parent's
light DOM because a component type is not a function.

Calling Stencil's hydrate module directly preserves the same child and text:

```sh
node --input-type=module - <<'JS'
import { renderToString } from './packages/stencil-lib/hydrate/index.mjs';
const result = await renderToString(
  '<slot-parent><scoped-child></scoped-child> trailing text</slot-parent>',
  { serializeShadowRoot: 'scoped', fullDocument: false },
);
console.log(result.html);
console.log(result.diagnostics);
JS
```

## Optional raw Stencil control

A separate client-side ordering failure also occurs without React or Next.js.
After building, run `node scripts/core-repro.mjs` and open
http://localhost:3001/. The input is the direct Stencil example above, with
one text node after the child. Registering the child first moves it after
the trailing text during hydration. The page prints the resulting node order.

http://localhost:3001/parent-first registers the parent first for comparison
and preserves the expected order. This is a diagnostic, not a recommended
workaround. This client-side failure is independent of the React adapter's
server-content loss.
