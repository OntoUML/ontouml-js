import _ from 'lodash';
import { OntoumlElement, Project, NamedElement, ProjectElement } from '..';

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

  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {
    // TODO: resolve references within propertyAssignments
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
