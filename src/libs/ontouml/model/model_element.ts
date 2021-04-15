import { OntoumlElement, Package } from '..';

export abstract class ModelElement extends OntoumlElement {
  propertyAssignments: object;

  constructor(type: string, base?: Partial<ModelElement>) {
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

  /** Clones the model element and all its contents. Replaces all references to
   * original contents with references to cloned elements. */
  abstract clone(): ModelElement;

  // TODO: replace references in property assignments
  /** Replaces references to `originalElement` with references to `newElement`.
   * Designed to be used within clone(). */
  abstract replace(originalElement: ModelElement, newElement: ModelElement): void;

  lock(): void {
    throw new Error('Method unimplemented!');
  }

  unlock(): void {
    throw new Error('Method unimplemented!');
  }

  isLocked(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns outermost package container of a model element which can either
   * 'model' package of a project, a package without a container, or null. This
   * is intended to support searches for other model elements within the same
   * context, regardless of the presence of a container project.
   */
  getModelOrRootPackage(): Package {
    if (this.project) {
      return this.project.model;
    }

    let packageReference = this.container;

    while (packageReference && packageReference.container) {
      packageReference = packageReference.container;
    }

    if (packageReference instanceof Package) {
      return packageReference;
    } else if (this instanceof Package) {
      return this;
    } else {
      return null;
    }
  }

  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {
    // TODO: resolve references within propertyAssignments
  }
}
