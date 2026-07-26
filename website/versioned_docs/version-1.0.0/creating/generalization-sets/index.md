---
sidebar_position: 1
title: Generalization sets
---

# Generalization sets

A **generalization set** groups several generalizations that share the same
general classifier and says something about them _together_: whether the
subtypes overlap, and whether they cover the supertype completely. It is how you
state "a `Person` is **either** a `Child` **or** an `Adult`, and nothing else."

:::info[Theory: disjointness and completeness]
Two orthogonal constraints define a generalization set:

- **Disjoint** — no instance belongs to more than one of the subtypes (you
  can't be both a Child and an Adult).
- **Complete** — every instance of the general belongs to at least one subtype
  (every Person is a Child or an Adult; there is no third option).

A set that is both disjoint and complete is a **partition** — the most common
and most informative case.
:::

## Building a generalization set

First build the generalizations you want to group (from
[the previous page](/creating/generalizations/)), then pass them to
`generalizationSetBuilder()`. The flags read declaratively: `.partition()`,
or any combination of `.disjoint()` / `.overlapping()` and `.complete()` /
`.incomplete()`.

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();

const person = model.classBuilder().kind().name('Person').build();
const child = model.classBuilder().phase().name('Child').build();
const adult = model.classBuilder().phase().name('Adult').build();

// The generalizations to group…
const childGen = person.addChild(child);
const adultGen = person.addChild(adult);

// …grouped into a partition (disjoint AND complete).
const byAge = model
  .generalizationSetBuilder()
  .partition()
  .name('by life phase')
  .generalizations(childGen, adultGen)
  .build();

console.log(byAge.isDisjoint); // true
console.log(byAge.isComplete); // true
console.log(byAge.isPartition()); // true
```

For an overlapping or incomplete set, swap the flag:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();
const person = model.classBuilder().kind().name('Person').build();
const employee = model.classBuilder().role().name('Employee').build();
const customer = model.classBuilder().role().name('Customer').build();

const employeeGen = person.addChild(employee);
const customerGen = person.addChild(customer);

// A person may be both, and need be neither: overlapping and incomplete.
const roles = model
  .generalizationSetBuilder()
  .overlapping()
  .incomplete()
  .name('by role')
  .generalizations(employeeGen, customerGen)
  .build();
```

## Reading a set back

The set can report its general and specifics without you tracking them
separately — handy when validating a taxonomy:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();
const person = model.classBuilder().kind().name('Person').build();
const child = model.classBuilder().phase().name('Child').build();
const adult = model.classBuilder().phase().name('Adult').build();

const byAge = model
  .generalizationSetBuilder()
  .partition()
  .generalizations(person.addChild(child), person.addChild(adult))
  .build();

console.log(byAge.getGeneral() === person); // true
console.log(byAge.getSpecifics().length); // 2 — Child, Adult
```

:::tip[The categorizer]
A high-order set can name the class whose instances _are_ the subtypes with
`.categorizer(type)`. That is an advanced, second-order modeling move — most
sets don't need it — but the builder supports it when you do.
:::

## Key takeaways

- A generalization set constrains a group of generalizations sharing one
  general classifier.
- **Disjoint** rules out shared instances; **complete** requires full coverage;
  `.partition()` is both at once.
- Build the generalizations first, then pass them to
  `generalizationSetBuilder().generalizations(...)`.
- Read a set back with `getGeneral()`, `getSpecifics()`, and `isPartition()`.

Next: [notes & anchors →](/creating/notes-anchors/), for annotating a model.
