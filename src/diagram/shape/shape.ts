import { OntoumlElement } from '../..';

/**
 * The abstract root of the geometric shapes that render diagram elements in
 * the OntoUML diagram interchange. Each {@link View} pairs a model element
 * with the shapes that render it on the canvas; shapes carry only geometry
 * (position, dimensions, points) and hold no reference to the model.
 */
export abstract class Shape extends OntoumlElement {
  constructor() {
    super();
  }
}
