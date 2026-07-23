# Agent guidelines

Guidance for AI agents (and humans) working in this repository.

## Layout

- [`src/`](src/) — the library. `src/model/` holds the abstract syntax
  (classes, relations, generalizations, …), `src/diagram/` the concrete
  syntax (diagrams, views, shapes), `src/builder/` the fluent builders, and
  `src/serialization.ts` the parser for OntoUML JSON.
- [`test/`](test/) — Jest suites mirroring `src/`.
- [`website/`](website/) — the Docusaurus tutorial site (its own npm
  package; see below).
- `dist/` is **generated** by tsup — never edit it by hand.

## Commands

- `npm test` — run the Jest suite.
- `npm run lint` — type-check with `tsc` (no emit).
- `npm run build` — bundle CJS + ESM + type declarations with tsup.
  **Always run this before calling the tree release-ready**: the DTS build
  compiles with ESNext class-field semantics and catches errors (e.g.
  TS2612) that `tsc` alone does not. Builder subclass fields must use
  `declare`, not `override`, for this reason.
- `npm run format` — Prettier over the repo (lint-staged also formats on
  commit via husky).

## Schema compliance

- The JSON serialization is defined by
  [`ontouml-schema`](https://www.npmjs.com/package/ontouml-schema) (dev
  dependency; also published at <https://w3id.org/ontouml/schema>). Every
  `toJSON()` and the parser in `src/serialization.ts` must stay in sync
  with it.
- The schema targets **JSON Schema draft 2020-12**: tests must import Ajv
  from `ajv/dist/2020` (the default `ajv` export cannot compile it) and
  apply `ajv-formats`.
- Round-trips are **byte-identical** on purpose: `parse` registers elements
  in serialized order, and the serialization tests compare JSON strings.
  Preserve this property when touching serialization.

## Dependency constraints

- `language-tags` must stay on **1.x** — 2.x is ESM-only and breaks the CJS
  build and Jest.
- `typescript` must satisfy ts-jest's peer range (currently `<7`).
- The ESM output must not use named imports from CJS-only packages (e.g.
  `import { remove } from 'lodash'`): Node rejects them at runtime even
  though bundlers accept them. Use default imports (`import _ from
'lodash'`). After dependency or import changes, smoke-test both entry
  points (`require('./dist/index.js')` and `import('./dist/index.mjs')`).

## Website

- The tutorial lives in `website/` (independent `package.json`; run `npm
install` there separately).
- `npm run build` in `website/` regenerates the Sandpack bundle from the
  library source (`scripts/bundle-ontouml.mjs`) and builds the site.
  `src/components/OntoumlSandpack/ontouml-bundle.generated.ts` is
  **generated** — never edit it by hand.
- Code blocks tagged ` ```ts twoslash ` are **type-checked at build time**
  against the real library API — a site build is therefore also a docs
  correctness check. Run it after any public-API change, and update the
  affected pages.
- Deployment to GitHub Pages is automated by
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on pushes
  to the default branch.

## Releasing / publishing

- The published tarball is limited by the `files` whitelist in
  `package.json` to `dist/` (+ README, LICENSE). `prepublishOnly`
  type-checks, tests, and rebuilds.
- Publishing to npm is automated via
  [`.github/workflows/publish.yml`](.github/workflows/publish.yml), which
  runs on a published GitHub Release using npm Trusted Publishing (OIDC —
  no token). To release: bump `version` in `package.json`, commit, tag
  `vX.Y.Z`, and create a GitHub Release from that tag.
- Published npm versions are immutable — a mistake in a release requires a
  new version, not a re-publish.
