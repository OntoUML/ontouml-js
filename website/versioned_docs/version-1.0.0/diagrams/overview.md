---
sidebar_position: 1
title: Diagrams & views
---

# Diagrams & views

Everything in the [Creating a model](/creating/projects-packages/) chapter was
**abstract syntax** — the model's meaning, independent of how it's drawn. This
chapter is about **concrete syntax**: the boxes, lines, and positions that
_depict_ a model on a canvas.

:::info[Theory: two layers, cleanly separated]
A model and its diagrams are deliberately decoupled. The same `Person` class
can appear in three diagrams, at three positions, or in none at all — its
meaning doesn't change. A diagram never _owns_ model elements; it only holds
**views** that point at them. This separation is why you can build a complete,
valid, serializable model without ever creating a diagram.
:::

## The object model

Three kinds of object make up the concrete syntax:

- **Diagram** — a named canvas. Diagrams belong to the **project** (not to a
  package), and a project may have any number of them.
- **View** — a depiction of one model element on a diagram: a `ClassView` for a
  class, a `BinaryRelationView` for a relation, a `GeneralizationView`, a
  `NoteView`, and so on. A view wraps its `element` and carries the shapes that
  draw it.
- **Shape** — the geometry: a `Rectangle` (with position, width, height) for a
  class or package box, a `Path` (a list of `Point`s) for a connector, a
  `Text` box for a note, a `Diamond` for an n-ary relation's hub.

So a diagram _has_ views, and each view _has_ one or more shapes. You lay out a
diagram by adding views and then positioning their shapes.

## How this chapter is organized

1. **[Creating a diagram](/diagrams/creating-a-diagram)** — make a canvas and
   drop class views onto it.
2. **[Positioning views](/diagrams/positioning-views)** — move and size the
   shapes behind those views.
3. **[Connecting elements](/diagrams/connecting-elements)** — relation and
   generalization views, and the paths that route them.
4. **[Notes & packages](/diagrams/notes-and-packages)** — the views that aren't
   created for you.
5. **[A complete diagram](/diagrams/a-complete-diagram)** — lay out a whole
   model end to end, then serialize it.

:::note[Deleting a view is safe]
Because views only _refer_ to model elements, deleting a view removes the
depiction and leaves the element untouched. Deleting the element, on the other
hand, cleans up every view of it across all diagrams.
:::

Start with [Creating a diagram →](/diagrams/creating-a-diagram).
