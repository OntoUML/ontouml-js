---
sidebar_position: 1
title: Generalizations
---

# Generalizations

A **generalization** is a single "is-a" link between a more general classifier
(the **general**, or supertype) and a more specific one (the **specific**, or
subtype): every `Student` is a `Person`, every `Man` is a `Person`.

:::info[Theory: taxonomy is one link at a time]
A generalization relates exactly **two** classifiers. A taxonomy is just many
generalizations sharing generals and specifics. Grouping several of them into a
constrained partition — "a person is exactly one of Child, Adult" — is a
separate construct, the [generalization set](/creating/generalization-sets/),
covered next. Generalizations connect classes to classes, but also relations to
relations; this page focuses on the common case of classes.
:::

## Two ways to build one

For a quick subtype link, the shortcut on any classifier is clearest.
`addChild` and `addParent` create the generalization and return it:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();

const person = model.classBuilder().kind().name('Person').build();
const student = model.classBuilder().role().name('Student').build();

// "Student is a Person" — reads general.addChild(specific).
const gen = person.addChild(student);

console.log(gen.general === person); // true
console.log(gen.specific === student); // true
```

When you want to name the generalization or place it in a specific package, use
the full builder — `general` is the supertype, `specific` is the subtype:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();
const person = model.classBuilder().kind().name('Person').build();
const man = model.classBuilder().subkind().name('Man').build();

const gen = model
  .generalizationBuilder()
  .general(person)
  .specific(man)
  .name('man-is-person')
  .build();
```

:::warning[A classifier cannot specialize itself]
Passing the same classifier as both `general` and `specific` throws at
`build()`. The two ends must be distinct.
:::

## Navigating the taxonomy

Once generalizations exist, every classifier can report its neighbours and its
full ancestry. `getParents()` / `getChildren()` are the direct links;
`getAncestors()` / `getDescendants()` walk the whole hierarchy transitively.

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();

const person = model.classBuilder().kind().name('Person').build();
const man = model.classBuilder().subkind().name('Man').build();
const student = model.classBuilder().role().name('Student').build();
const phdStudent = model.classBuilder().role().name('PhDStudent').build();

person.addChild(man);
person.addChild(student);
student.addChild(phdStudent);

console.log(person.getChildren().length); // 2 — Man, Student
console.log(phdStudent.getParents().length); // 1 — Student
console.log(phdStudent.getAncestors().length); // 2 — Student, Person
```

These navigation methods are the foundation of the
[Querying](/querying/) chapter, where they drive analyses like "find every
concrete subtype of this category."

## Key takeaways

- A generalization links one **general** (supertype) to one **specific**
  (subtype).
- `general.addChild(specific)` and `specific.addParent(general)` are the quick
  path; `generalizationBuilder()` adds naming and container control.
- A classifier **cannot specialize itself**.
- Walk the hierarchy with `getParents` / `getChildren` (direct) and
  `getAncestors` / `getDescendants` (transitive).

Next: [generalization sets →](/creating/generalization-sets/), which constrain
a group of generalizations into a partition.
