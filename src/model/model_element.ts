import _ from 'lodash';
import {
  OntoumlElement,
  Project,
  NamedElement,
  ProjectElement,
  Package,
  PackageableElement
} from '..';

/**
 * The abstract base class of all elements that constitute an OntoUML model,
 * such as classes, relations, generalizations, and packages — as opposed to
 * diagrammatic elements, which only concern the visual representation of a
 * model.
 *
 * Every model element belongs to a {@link Project} and may reside in a
 * container element (e.g., a class within a {@link Package}, or a property
 * within a class).
 */
export abstract class ModelElement
  extends NamedElement
  implements ProjectElement
{
  _project: Project;
  _container?: ModelElement;

  /**
   * Arbitrary user-defined key-value pairs attached to the element, intended
   * for data that is not covered by the OntoUML metamodel.
   */
  customProperties: object = {};

  constructor(project: Project) {
    super();
    this._project = project;
  }

  /**
   * The model elements directly contained by this element. Subclasses that
   * act as containers (e.g., {@link Package}, {@link Class}) override this
   * getter; by default, an element contains nothing.
   */
  get contents(): ModelElement[] {
    return [];
  }

  override getContents(): OntoumlElement[] {
    return this.contents;
  }

  /** The project that contains this element. */
  get project(): Project {
    return this._project;
  }

  /**
   * Sets the project that contains this element, propagating the value to
   * all of its contents.
   */
  set project(value: Project) {
    this._project = value;
    this.contents.forEach(me => (me.project = value));
  }

  /** The model element that directly contains this element, if any. */
  get container(): ModelElement | undefined {
    return this._container;
  }

  /**
   * Sets the model element that directly contains this element, updating the
   * element's project to that of the new container when available.
   */
  set container(newContainer: ModelElement | undefined) {
    this._container = newContainer;

    if (newContainer?.project) {
      this.project = newContainer.project;
    }
  }

  /**
   * Deletes this element from its project, keeping the model consistent:
   * the deletion cascades to the elements that cannot exist without this
   * one (see {@link deleteDependents}), every reference to this element
   * held by other elements is cleaned up (see {@link removeReferences}),
   * and the element is detached from its container and removed from the
   * project's indexes.
   *
   * Deleting an element that was already deleted has no effect.
   */
  delete(): void {
    if (!this.project.deregister(this)) {
      return;
    }

    this.deleteDependents();
    this.removeReferences();
    this.detach();
  }

  /**
   * Deletes the elements that cannot exist without this one: the anchors
   * that attach notes to it and the views that depict it in diagrams.
   * Subclasses extend this method with type-specific dependents (e.g.,
   * classifiers also delete the generalizations and relations that connect
   * them).
   */
  protected deleteDependents(): void {
    this.project.anchors
      .filter(a => a !== (this as ModelElement) && a.element === this)
      .forEach(a => a.delete());

    this.project.views.filter(v => v.element === this).forEach(v => v.delete());
  }

  /**
   * Removes the non-containment references to this element held by other
   * elements of the project. Subclasses extend this method with
   * type-specific references (e.g., a class clears the categorizer field
   * of the generalization sets it categorizes).
   */
  protected removeReferences(): void {
    this.project.diagrams
      .filter(d => d.owner === this)
      .forEach(d => (d.owner = undefined));
  }

  /**
   * Detaches this element from its container. Subclasses whose containers
   * are not packages (e.g., properties and literals) override this method.
   */
  protected detach(): void {
    if (this._container instanceof Package) {
      this._container.removeContent(this as unknown as PackageableElement);
    }

    this._container = undefined;
  }

  override toJSON(): any {
    const object = {
      customProperties: !_.isEmpty(this.customProperties)
        ? this.customProperties
        : null
    };

    return { ...super.toJSON(), ...object };
  }
}
