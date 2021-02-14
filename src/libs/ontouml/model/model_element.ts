import { OntoumlElement } from '../ontouml_element';
import { Package } from './package';

export abstract class ModelElement extends OntoumlElement {
  propertyAssignments: object;

  constructor(type: string, base?: Partial<ModelElement>) {
    super(type, base);

    this.propertyAssignments = this.propertyAssignments || {};
  }

  toJSON(): any {
    const modelElementSerialization = {
      propertyAssignments: null
    };

    Object.assign(modelElementSerialization, super.toJSON());

    return modelElementSerialization;
  }

  // TODO: add documentation
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
}
