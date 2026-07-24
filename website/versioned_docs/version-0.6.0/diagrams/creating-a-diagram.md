---
sidebar_position: 2
title: Creating a diagram
---

# Creating a diagram

A diagram is created **from the project**, since diagrams belong to the project
rather than to any package. `createDiagram` makes one, names it, and registers
it in a single call.

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();

const diagram = project.createDiagram('Overview');

console.log(project.diagrams.length); // 1
```

:::tip[Prefer `createDiagram` over `new Diagram(...)`]
Constructing `new Diagram(project)` directly does **not** register it — the
project won't list it until you call `project.addDiagram(...)`.
`project.createDiagram(name)` does both for you.
:::

## Adding class views

The quickest way to depict something is the family of `add…` factory methods on
the diagram. Each creates the right view _with default shapes_ and adds it.
`addClass` returns a `ClassView`:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();

const person = model.classBuilder().kind().name('Person').build();
const school = model.classBuilder().kind().name('School').build();

const diagram = project.createDiagram('Overview');

const personView = diagram.addClass(person);
const schoolView = diagram.addClass(school);

console.log(diagram.getClassViews().length); // 2
console.log(personView.element === person); // true
```

The new class views land at the origin with a default size — the
[next page](/diagrams/positioning-views) is about moving them.

## Adding any element generically

When you're depicting a mixed bag of elements, `addModelElement` dispatches to
the right view type for you, and `addModelElements` does a whole array at once:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const person = model.classBuilder().kind().name('Person').build();
const school = model.classBuilder().kind().name('School').build();

const diagram = project.createDiagram('Overview');

// Depict a mixed batch of elements; each is dispatched to the right view type.
diagram.addModelElements([person, school]);

console.log(diagram.views.length >= 2); // true
```

## Checking what's already depicted

Views are keyed by the model element they wrap, so you can ask a diagram whether
it already shows something before adding it again:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const person = model.classBuilder().kind().name('Person').build();

const diagram = project.createDiagram('Overview');
diagram.addClass(person);

console.log(diagram.containsView(person)); // true
const view = diagram.findView(person); // the ClassView, or undefined
```

`findOrCreateView(element)` combines the two: it returns the existing view or
creates one — which is exactly what the connector factories on the next pages
rely on.

## Key takeaways

- Diagrams belong to the **project**; make one with
  `project.createDiagram(name)`.
- `diagram.addClass(c)` creates and adds a `ClassView`; `addModelElement(s)`
  handles arbitrary element types.
- Views are keyed by their element — `containsView`, `findView`, and
  `findOrCreateView` let you avoid duplicates.

Next: [positioning views →](/diagrams/positioning-views).
