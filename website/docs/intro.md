---
slug: /
sidebar_position: 1
title: Introduction
---

# Build OntoUML models with code

`ontouml-js` is a TypeScript/JavaScript library for creating, editing, and
querying [OntoUML](https://ontouml.org) models **programmatically** — no visual
editor required. Instead of dragging boxes on a canvas, you write code:

```ts
const person = model.classBuilder().kind().name('Person').build();
```

This tutorial teaches you to do that from scratch. By the end you will be able
to build a full domain ontology in code, query it, validate it, and serialize
it to the same JSON format the OntoUML visual tools use.

## Who this is for

You should be comfortable reading basic **TypeScript or JavaScript**. You do
**not** need to be an OntoUML expert — each chapter that introduces a modeling
construct (kinds, roles, relators, …) starts with a short _theory box_
explaining the idea before we write any code. If you already know OntoUML, skim
those boxes and focus on the API.

## How this tutorial works

Two things make this a _hands-on_ book:

- **Every code sample is real.** Inline examples are type-checked against the
  actual `ontouml-js` API when this site is built. If a sample wouldn't
  compile, the site wouldn't have shipped. Hover any identifier to see its
  inferred type, just like in your editor.
- **You write code too.** At the "now you try it" points, there's a live
  editor running in your browser. You complete a partial model and watch the
  serialized output update as you type.

## The road ahead

After **Getting started**, the guide is organized around the things you do
with a model:

1. **Creating a model** — build every kind of element from scratch: projects &
   packages, classes & stereotypes, attributes, binary and n-ary relations,
   generalizations, generalization sets, and notes.
2. **Creating diagrams** — give a model a _concrete syntax_: lay out the views
   and shapes that depict its elements on a canvas.
3. **Manipulating (editing) a model** — change a model after it's built: rename
   and re-stereotype elements, move them between packages, and delete them.
4. **Querying a model** — read a model back: collection getters, lookups,
   stereotype and ontological-category queries, predicates, and navigation —
   the toolkit for analyses and transformations.

A closing part covers **serialization & validation** — round-tripping models as
JSON.

Ready? Head to [Getting started →](/getting-started/what-is-ontouml).
