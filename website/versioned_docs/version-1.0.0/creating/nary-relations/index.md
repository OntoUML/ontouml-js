---
sidebar_position: 1
title: N-ary relations
---

# N-ary relations

Some connections are irreducibly between **three or more** classes at once. A
medical _treatment_ ties a patient, a physician, and a medication together;
splitting it into separate binary links would lose the fact that the three
occur as a single unit. That is what an **n-ary relation** captures.

:::info[Theory: when a relation isn't binary]
Reach for an n-ary relation only when the association genuinely holds among
several classes _jointly_ — no single pair carries the meaning on its own. Very
often what looks n-ary is better modeled by **reifying** it into a `«relator»`
(a `Treatment` class) mediated to each participant with binary
`«mediation»` relations, which lets each link carry its own cardinality. Prefer
the relator pattern when in doubt; use a true n-ary relation when the reified
entity would add nothing.
:::

## Building an n-ary relation

Use `naryRelationBuilder()` and pass all participants to `members(...)`. At
least **three** are required — fewer throws at `build()`. Only two stereotypes
apply to n-ary relations: `.material()` and `.comparative()`.

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

console.log(treatment.properties.length); // 3
```

## Ends

An n-ary relation has **one end per member**, in the order you passed them, and
each end is a `Property` — so, as with binary relations, cardinality and the
other end meta-properties live there. Reach the ends through `properties`.

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

const [patientEnd, physicianEnd, medicationEnd] = treatment.properties;

// Any number of patients, at least one physician, one medication.
patientEnd.cardinality.setAsZeroToMany();
physicianEnd.cardinality.setAsOneToMany();
medicationEnd.cardinality.setAsOneToOne();
```

:::warning[Members are set as a whole]
`members(...)` **replaces** the member list each time it is called, and the
builder is single-use. Pass every participant in one call, in the order you
want the ends to appear.
:::

## Key takeaways

- An n-ary relation connects **three or more** classifiers passed to
  `members(...)`; fewer than three fails at `build()`.
- Only `.material()` and `.comparative()` are valid stereotypes.
- It has **one `Property` end per member**, in argument order, reachable via
  `relation.properties`.
- Consider **reifying** into a `«relator»` when each participation needs its
  own richer constraints.

Next: [generalizations →](/creating/generalizations/), where classes are
arranged into taxonomies.
