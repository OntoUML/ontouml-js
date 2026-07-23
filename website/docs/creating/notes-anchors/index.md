---
sidebar_position: 1
title: Notes & anchors
---

# Notes & anchors

Not everything worth recording is part of the ontology itself. A **note** is a
free-text annotation — a modeling decision, a caveat, a "revisit this" — and an
**anchor** is the link that attaches a note to the element it comments on.
Together they are OntoUML's equivalent of a UML comment and its connector.

:::info[Theory: annotations are not model elements you reason over]
Notes and anchors carry no ontological meaning: they don't constrain instances
and they're ignored by semantic analyses. They exist for the humans reading the
model. A note can float on its own, or be anchored to one _or several_ elements
when the same remark applies to more than one.
:::

## Writing a note

Build a note from its container package with `noteBuilder()` and give it text.
The text is multilingual, just like element names, so a language tag is
accepted as an optional second argument.

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('Library').build();

const note = model
  .noteBuilder()
  .text('Loan periods differ by member type — confirm with the library.')
  .build();

console.log(project.notes.length); // 1
```

## Anchoring it to an element

An unattached note is valid but rootless. To point it at something, build an
**anchor** that connects the `note` to the element it `annotates`. The most
direct route is `note.anchorBuilder()`, which pre-fills the note for you:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('Library').build();

const loan = model.classBuilder().relator().name('Loan').build();

const note = model
  .noteBuilder()
  .text('Loan periods differ by member type.')
  .build();

const anchor = note.anchorBuilder().annotates(loan).build();

console.log(anchor.note === note); // true
console.log(anchor.element === loan); // true
```

Equivalently, build the anchor from a package and set both ends explicitly —
useful when you want the anchor to live in a particular package:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('Library').build();
const person = model.classBuilder().kind().name('Person').build();
const note = model.noteBuilder().text('Members are always persons.').build();

model.anchorBuilder().note(note).annotates(person).build();

console.log(project.anchors.length); // 1
```

:::tip[One note, many anchors]
A note can annotate several elements at once: build multiple anchors from the
same note, each with a different `annotates(...)` target. Each anchor is an
independent link.
:::

## Key takeaways

- A **note** is free multilingual text; build it with `noteBuilder().text(...)`.
- An **anchor** attaches a note to an element — `note.anchorBuilder()` is the
  shorthand; `package.anchorBuilder().note(...).annotates(...)` gives container
  control.
- Notes and anchors are **annotations**: no ontological force, purely for
  readers.
- Read them back through `project.notes` and `project.anchors`; an anchor
  exposes `note` and `element`.

That completes the model layer. Next, give your model a visual form in
[Creating diagrams →](/diagrams/).
