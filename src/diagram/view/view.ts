import {
  ModelElement,
  OntoumlElement,
  Shape,
  Project,
  BinaryConnectorView,
  AnchorView,
  NaryRelationView,
  GeneralizationSetView
} from '../..';

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
   * Deletes this view from its project and from the diagrams that contain
   * it. The deletion cascades to the connector views that cannot exist
   * without this one (e.g., the views of the relations and generalizations
   * attached to a deleted class view), and this view is removed from the
   * generalization view lists of the generalization set views that
   * reference it. The depicted model element is not affected.
   *
   * Deleting a view that was already deleted has no effect.
   */
  delete(): void {
    const project = this.element.project;

    if (!project.deregister(this)) {
      return;
    }

    this.deleteDependentViews(project);
    project.diagrams.forEach(d => d.removeView(this));
  }

  /**
   * Deletes the views that cannot exist without this one: binary
   * connector views attached to it, anchor views connected to it, and
   * n-ary relation views among whose members it appears. Generalization
   * set views are not deleted; this view is only removed from their
   * generalization view lists.
   */
  private deleteDependentViews(project: Project): void {
    for (const v of project.views) {
      if (
        v instanceof BinaryConnectorView &&
        (v.source === this || v.target === this)
      ) {
        v.delete();
      } else if (
        v instanceof AnchorView &&
        (v.noteView === (this as View<any>) ||
          v.elementView === (this as View<any>))
      ) {
        v.delete();
      } else if (
        v instanceof NaryRelationView &&
        v.members.includes(this as any)
      ) {
        v.delete();
      } else if (v instanceof GeneralizationSetView) {
        v.generalizations = v.generalizations.filter(
          g => (g as View<any>) !== (this as View<any>)
        );
      }
    }
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
