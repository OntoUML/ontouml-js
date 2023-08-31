import _ from 'lodash';
import { OntoumlElement, Project, NamedElement } from '..';

export abstract class ModelElement extends NamedElement {
  customProperties: object = {};
  protected _container?: ModelElement;

  constructor(project: Project, container?: ModelElement) {
    super(project);
    this.container = container;
  }

  // TODO: This method is no longer necessary.
  /**
   * Returns outermost package container of a model element which can either
   * 'model' package of a project, a package without a container, or null. This
   * is intended to support searches for other model elements within the same
   * context, regardless of the presence of a container project.
   */
  // getRoot(): Package | undefined {
  //   if (this?.project?.root) {
  //     return this?.project?.root;
  //   }

  // let packageReference = this.container;

  // while (packageReference && packageReference.container) {
  //   packageReference = packageReference.container;
  // }

  // if (packageReference instanceof Package) {
  //   return packageReference;
  // }

  // if (this instanceof Package) {
  //   return this;
  // }

  // return null;
  // }

  public get container(): ModelElement | undefined {
    return this._container;
  }

  public set container(newContainer: ModelElement | undefined) {
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
