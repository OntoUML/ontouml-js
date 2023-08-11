import { OntoumlElement, OntoumlType, Package } from '../index';

export abstract class ModelElement extends OntoumlElement {
  //TODO: Rename to customProperties
  propertyAssignments: object;

  constructor(type: OntoumlType, base?: Partial<ModelElement>) {
    super(type, base);

    this.propertyAssignments = base?.propertyAssignments || {};
  }

  toJSON(): any {
    const modelElementSerialization = {
      propertyAssignments: null
    };

    Object.assign(modelElementSerialization, super.toJSON());

    return modelElementSerialization;
  }


  /**
   * Returns outermost package container of a model element which can either
   * 'model' package of a project, a package without a container, or null. This
   * is intended to support searches for other model elements within the same
   * context, regardless of the presence of a container project.
   */
  getRoot(): Package | null {
    if (this.project) {
      return this.project.model;
    }

    let packageReference = this.container;

    while (packageReference && packageReference.container) {
      packageReference = packageReference.container;
    }

    if (packageReference instanceof Package) {
      return packageReference;
    }
    
    if (this instanceof Package) {
      return this;
    }
    
    return null;
  }

  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {
    // TODO: resolve references within propertyAssignments
  }
}
