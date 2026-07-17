import { ModelElement, OntoumlElement, Shape } from '../..';

/**
 * The abstract root of the view hierarchy in the OntoUML diagram
 * interchange. A view pairs a {@link ModelElement} with the {@link Shape}
 * instances that render it on a {@link Diagram}: node views (e.g.,
 * {@link ClassView}) are rendered by rectangular shapes, while connector
 * views (e.g., {@link GeneralizationView}) are rendered by paths.
 *
 * The same model element may be depicted in several diagrams, or several
 * times in the same diagram, each occurrence having its own view.
 */
export abstract class View<T extends ModelElement> extends OntoumlElement {
  /** The model element this view depicts. */
  readonly element: T;

  constructor(element: T) {
    super();

    this.element = element;
  }

  /** The shapes that render this view on the diagram canvas. */
  abstract get shapes(): Shape[];

  /** Returns the shapes contained in this view. */
  override getContents(): OntoumlElement[] {
    return this.shapes;
  }

  /**
   * Always throws, as reference resolution for deserialized views is not yet
   * implemented.
   */
  override resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Serializes the view, referencing the depicted model element by id
   * through the `isViewOf` field.
   */
  override toJSON(): any {
    return {
      ...super.toJSON(),
      isViewOf: this.element.id
    };
  }
}
