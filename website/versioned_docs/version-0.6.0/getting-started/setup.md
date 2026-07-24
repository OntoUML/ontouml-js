---
sidebar_position: 2
title: Setup
---

# Setup

You can follow this whole tutorial **without installing anything** — the live
editors in each chapter run `ontouml-js` in your browser. But to build real
projects you'll want it locally.

## Install

`ontouml-js` runs on **Node.js 18+**. Add it to a project:

```bash
npm install ontouml-js
```

## A first script

Create `model.ts` (or `.js`) and import from the package:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
project.name.add('My first project');

console.log(project.name.get());
```

Run it with your favourite TypeScript runner (`tsx`, `ts-node`) or compile with
`tsc`. If you see `My first project`, you're ready.

:::tip[TypeScript recommended]
`ontouml-js` is written in TypeScript and ships full type definitions. Using it
from TypeScript means your editor autocompletes stereotypes and builder
methods, and catches mistakes before you run anything. Every example in this
tutorial is type-checked, so what you read is guaranteed to compile.
:::

Next: [build a complete model, end to end →](/getting-started/hello-model).
