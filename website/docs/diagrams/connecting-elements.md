---
sidebar_position: 4
title: Connecting elements
---

# Connecting elements

Relations and generalizations are drawn as **connectors** — lines routed
between the views of the elements they link. The diagram's connector factories
do the fiddly part for you: they create the connector view _and_ make sure both
endpoints have views to attach to.

:::info[Endpoints are created for you]
`addBinaryRelation`, `addGeneralization`, and `addNaryRelation` each call
`findOrCreateView` on the classifiers they connect. If a class isn't on the
diagram yet, its view is added automatically — so you can drop a relation onto
an empty canvas and get everything you need.
:::

## Binary relations

`addBinaryRelation` returns a `BinaryRelationView`. It has a `source` and a
`target` view (the auto-created endpoints) and a `path` — the polyline that
draws the connector. Route the path with `moveTo(x, y)`, which appends a point.

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();

const person = model.classBuilder().kind().name('Person').build();
const school = model.classBuilder().kind().name('School').build();
const studiesAt = model
  .binaryRelationBuilder()
  .material()
  .name('studies at')
  .source(person)
  .target(school)
  .build();

const diagram = project.createDiagram('Overview');
const relView = diagram.addBinaryRelation(studiesAt);

// Both endpoint class views were created automatically:
console.log(diagram.containsView(person)); // true
console.log(diagram.containsView(school)); // true

// Route the connector as a two-point line:
relView.path.moveTo(140, 60);
relView.path.moveTo(300, 60);

console.log(relView.source.element === person); // true
```

## Generalizations

`addGeneralization` takes a `Generalization` (built in the
[Generalizations](/creating/generalizations/) chapter) and returns a
`GeneralizationView`, with the general as `source` and the specific as
`target`:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('People').build();
const person = model.classBuilder().kind().name('Person').build();
const student = model.classBuilder().role().name('Student').build();

const isAStudent = person.addChild(student);

const diagram = project.createDiagram('Taxonomy');
const genView = diagram.addGeneralization(isAStudent);

genView.path.moveTo(120, 80);
genView.path.moveTo(120, 160);
```

## Generalization sets

A generalization set is drawn as a labelled marker joining its member
generalization connectors. `addGeneralizationSet` returns a
`GeneralizationSetView`:

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
  .name('by life phase')
  .generalizations(person.addChild(child), person.addChild(adult))
  .build();

const diagram = project.createDiagram('Taxonomy');
const gsView = diagram.addGeneralizationSet(byAge);

console.log(gsView.element === byAge); // true
```

## N-ary relations

An n-ary relation is drawn with a central **diamond** and one path per member.
`addNaryRelation` returns a `NaryRelationView` whose `diamond` you position and
whose `paths` (one per member, in order) you route:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('Clinic').build();
const patient = model.classBuilder().role().name('Patient').build();
const physician = model.classBuilder().role().name('Physician').build();
const medication = model.classBuilder().kind().name('Medication').build();

const treatment = model
  .naryRelationBuilder()
  .material()
  .name('treated with')
  .members(patient, physician, medication)
  .build();

const diagram = project.createDiagram('Treatments');
const naryView = diagram.addNaryRelation(treatment);

// Put the hub in the middle; the member class views were auto-created.
naryView.diamond.setX(200);
naryView.diamond.setY(150);

console.log(naryView.members.length); // 3
```

## Key takeaways

- Connector factories **auto-create endpoint views** via `findOrCreateView`.
- `addBinaryRelation` → `BinaryRelationView` with `source`, `target`, and a
  `path` routed by `moveTo(x, y)`.
- `addGeneralization` → `GeneralizationView` (source = general, target =
  specific); `addGeneralizationSet` → `GeneralizationSetView`.
- `addNaryRelation` → `NaryRelationView` with a `diamond` hub and one `path`
  per member.

Next: [notes & packages →](/diagrams/notes-and-packages).
