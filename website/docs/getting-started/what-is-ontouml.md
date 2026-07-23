---
sidebar_position: 1
title: What is OntoUML?
---

# What is OntoUML, and why model in code?

**OntoUML** is a conceptual modeling language. It looks like UML class diagrams,
but every class and relation carries an **ontological stereotype** — `«kind»`,
`«role»`, `«relator»`, and so on — drawn from the Unified Foundational Ontology
(UFO). Those stereotypes force you to be precise about the _nature_ of the
things you model: what can exist on its own, what depends on something else,
what a thing can stop being without ceasing to exist.

You don't need to memorize the theory now. We'll introduce each stereotype in
context, with a short theory box, as we build models that use it.

## Why a library instead of a visual editor?

Most people draw OntoUML models in a visual tool. So why write code?

- **Generation.** Produce large or repetitive models from data — a database
  schema, a spreadsheet, another ontology.
- **Transformation.** Convert an OntoUML model into OWL, a relational schema,
  or text; or refactor a model in bulk.
- **Validation & analysis.** Walk a model and check rules ("every `«kind»`
  should provide an identity principle"), compute metrics, or lint it.
- **Automation.** Wire model changes into CI, tests, and pipelines.

`ontouml-js` gives you a typed, in-memory representation of a model that you can
build, query, and serialize — and the serialization format is exactly the JSON
the visual tools read and write, so code and canvas interoperate.

## What you'll build

In the next two chapters you'll install the library and build a small model of
students enrolling at a school — a classic example that touches kinds, relators,
relations, and serialization in about twenty lines of code.

Let's [set up →](/getting-started/setup).
