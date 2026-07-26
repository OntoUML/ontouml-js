---
sidebar_position: 5
title: Notes & packages
---

# Notes & packages

Most elements have a one-call factory (`addClass`, `addBinaryRelation`, …). Two
do not: **notes** and **anchors** have no `add…` shortcut, so you build their
views by hand. **Packages** do have a factory. This page covers all three.

## Package views

`addPackage` mirrors `addClass` — it returns a `PackageView` whose box is a
`rectangle` you position like any other:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const people = model.packageBuilder().name('People').build();

const diagram = project.createDiagram('Overview');
const peopleView = diagram.addPackage(people);

peopleView.rectangle.setX(40);
peopleView.rectangle.setY(40);
peopleView.rectangle.width = 200;
peopleView.rectangle.height = 160;
```

## Note views (built by hand)

There is no `addNote`. Construct a `NoteView` around the note, add it with the
low-level `addView`, then position its `text` box:

```ts twoslash
import { Project, NoteView } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const note = model
  .noteBuilder()
  .text('Enrollment periods are set per term.')
  .build();

const diagram = project.createDiagram('Overview');

const noteView = new NoteView(note);
diagram.addView(noteView);

noteView.text.setX(260);
noteView.text.setY(60);

console.log(diagram.views.includes(noteView)); // true
```

## Anchor views (the dashed link)

An [anchor](/creating/notes-anchors/) is drawn as a dashed line from a note view
to the view of the element it annotates. An `AnchorView` needs all three — the
anchor, the `NoteView`, and the target element's view:

```ts twoslash
import { Project, NoteView, AnchorView } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const person = model.classBuilder().kind().name('Person').build();
const note = model.noteBuilder().text('Members are always persons.').build();
const anchor = note.anchorBuilder().annotates(person).build();

const diagram = project.createDiagram('Overview');
const personView = diagram.addClass(person);

const noteView = new NoteView(note);
diagram.addView(noteView);

// Link the note view to the class view.
const anchorView = new AnchorView(anchor, noteView, personView);
diagram.addView(anchorView);

console.log(anchorView.noteView === noteView); // true
console.log(anchorView.elementView === personView); // true
```

:::tip[`addView` vs the `add…` factories]
`addView` is the primitive: it registers a view you constructed yourself. The
`add…` factories are conveniences layered on top that build the view (with
default shapes) _and_ call `addView`. Notes and anchors simply don't have such a
convenience — so you reach for `addView` directly.
:::

## Key takeaways

- `addPackage(pkg)` → `PackageView`, positioned via its `rectangle` like a
  class view.
- Notes and anchors have **no factory**: construct `new NoteView(note)` /
  `new AnchorView(anchor, noteView, elementView)` and register them with
  `diagram.addView(...)`.
- A `NoteView` carries a `text` shape; an `AnchorView` links a `noteView` to an
  `elementView`.

Next: [a complete diagram →](/diagrams/a-complete-diagram).
