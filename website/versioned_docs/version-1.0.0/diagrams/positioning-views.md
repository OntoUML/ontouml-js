---
sidebar_position: 3
title: Positioning views
---

# Positioning views

A freshly added view sits at the origin `(0, 0)` with a default size. Laying
out a diagram means moving and resizing the **shapes** behind its views — for a
class or package that shape is a `Rectangle`.

:::info[Coordinates]
The canvas uses screen coordinates: `x` grows rightward, `y` grows **downward**,
and the position of a rectangle is its **top-left** corner. Units are abstract
"diagram units" — treat them like pixels.
:::

## Moving and sizing a class view

A `ClassView` exposes its box as `rectangle`. Set its position with
`setX` / `setY` and its size with the `width` / `height` accessors:

```ts twoslash
import { Project } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const person = model.classBuilder().kind().name('Person').build();

const diagram = project.createDiagram('Overview');
const personView = diagram.addClass(person);

personView.rectangle.setX(80);
personView.rectangle.setY(40);
personView.rectangle.width = 140;
personView.rectangle.height = 70;

console.log(personView.rectangle.getX()); // 80
console.log(personView.rectangle.getY()); // 40
```

:::warning[Width and height must be positive]
Assigning a zero or negative `width` or `height` throws. A class view defaults
to `100 × 50` and a package view to `60 × 30`, so you only need to set a size
when the default doesn't fit.
:::

## Positioning at construction with a Point

A `Point` is a simple `(x, y)` pair. You can hand one to a `Rectangle`'s
constructor to place it in one step, which is handy when you build shapes
yourself (as with notes, later in this chapter):

```ts twoslash
import { Rectangle, Point } from 'ontouml-js';

// A 120×60 box whose top-left corner is at (200, 100).
const box = new Rectangle(new Point(200, 100), 120, 60);

console.log(box.getX(), box.getY()); // 200 100
console.log(box.width, box.height); // 120 60
```

## A tidy row of classes

Layout is just arithmetic over these setters. Here's a helper that lines views
up left to right with even spacing:

```ts twoslash
import { Project, ClassView } from 'ontouml-js';

const project = new Project();
const model = project.packageBuilder().root().name('School').build();
const person = model.classBuilder().kind().name('Person').build();
const school = model.classBuilder().kind().name('School').build();
const course = model.classBuilder().kind().name('Course').build();

const diagram = project.createDiagram('Overview');
const views = [person, school, course].map(c => diagram.addClass(c));

function layoutRow(views: ClassView[], top: number, gap: number): void {
  let x = 40;
  for (const view of views) {
    view.rectangle.setX(x);
    view.rectangle.setY(top);
    x += view.rectangle.width + gap;
  }
}

layoutRow(views, 60, 40);
```

## Key takeaways

- New views start at `(0, 0)`; you position them by mutating their shapes.
- A class/package view's box is `view.rectangle`; use `setX` / `setY` and the
  `width` / `height` accessors.
- **Positive sizes only** — zero or negative dimensions throw.
- A `Point(x, y)` can preset a `Rectangle`'s top-left corner at construction.

Next: [connecting elements →](/diagrams/connecting-elements).
