# ontouml-js tutorial site

An interactive [Docusaurus](https://docusaurus.io) tutorial that teaches
programming with `ontouml-js`. Deployed to GitHub Pages at
`https://ontouml.github.io/ontouml-js/`.

## Local development

The site depends on the **local** `ontouml-js` (via `"ontouml-js": "file:.."`
in `package.json`), so build the library first:

```bash
# from the repo root
npm ci
npm run build          # produces dist/ with type declarations

cd website
npm install
npm start              # dev server at http://localhost:3000/ontouml-js/
npm run build          # production build (also type-checks all snippets)
```

## How code samples work

- **Inline samples** tagged ` ```ts twoslash ` are rendered and **type-checked
  at build time** by [Shiki + Twoslash](https://shiki.style/packages/twoslash)
  against the real `ontouml-js` types. A type error fails the build — the
  tutorial cannot drift from the API.
- **Live exercises** use [`<OntoumlSandpack>`](src/components/OntoumlSandpack),
  a browser playground running the **local** library (see below).

## How Sandpack gets the library

The playground does **not** install `ontouml-js` from npm — the API taught
here isn't published yet, and the old published `0.5.0` doesn't even load in
Sandpack (its `n3` dependency now pulls in `readable-stream@4`, whose
top-level `const process` collides with the `process` shim Sandpack injects
into every module, crashing with _"Identifier 'process' has already been
declared"_).

Instead, [`scripts/bundle-ontouml.mjs`](scripts/bundle-ontouml.mjs) — run
automatically by `prestart`/`prebuild`/`pretypecheck` — bundles `../src` with
esbuild into a single browser-safe file
(`src/components/OntoumlSandpack/ontouml-bundle.generated.ts`, gitignored).
`<OntoumlSandpack>` injects it into every sandbox as
`/node_modules/ontouml-js/`, which Sandpack resolves before reaching for the
registry. Live exercises therefore always run the exact API version the docs
are written against, published or not.

## Structure

Chapters mirror the library's layers and live under `docs/`:

```
docs/
  intro.md                     # landing page (served at /)
  getting-started/             # install + first model (fully written)
  projects-packages/           # containers (fully written)
  classes-stereotypes/         # stereotype vocabulary (outline stub)
  properties-relations/        # attributes & relations (outline stub)
  generalizations/             # taxonomy & gen. sets (outline stub)
  diagrams/                    # concrete syntax (outline stub)
  serialization/               # JSON round-trip & validation (outline stub)
```
