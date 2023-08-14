import uniqid from 'uniqid';
import _ from 'lodash';
import { OntoumlType, Project } from '.';

export abstract class OntoumlElement {
  id: string;
  project?: Project;

  constructor(project?: Project) {
    this.id = uniqid();
    this.project = project;
  }
 
 

  setProject(project: Project): void {
    this.project = project;
    this.getContents().forEach(element => element.setProject(project));
  }

  getAllContents(): OntoumlElement[] {
    let children = this.getContents();

    if (children.length == 0) {
      return children;
    }

    let descendants = children.flatMap(child => child.getAllContents());

    return children.concat(descendants);
  }

  assertProject() {
    if (!this.project) {
      throw new Error("The element has no project project.");
    }
  }

  abstract getContents(): OntoumlElement[];

  /** Clones the model element and all its contents. Replaces all references to
   * original contents with references to cloned elements. */
  abstract clone(): OntoumlElement;

  // TODO: replace references in property assignments
  /** Replaces references to `originalElement` with references to `newElement`.
   * Designed to be used within clone(). */
  abstract replace(originalElement: OntoumlElement, newElement: OntoumlElement): void;

  lock(): void {
    throw new Error('Method unimplemented!');
  }

  unlock(): void {
    throw new Error('Method unimplemented!');
  }

  isLocked(): boolean {
    throw new Error('Method unimplemented!');
  }
  
  toJSON(): any {
    const object : any = {
      id: this.id
    };

    return object;
  }

  /** Resolve fields containing references (i.e., not contents) replacing the
   * object with the instance of `OntoumlElement` in `elementReferenceMap` with
   * the same `id`. This method is NOT recursive.
   *
   * @throws throws an error when no entry in the `elementReferenceMap` has a
   * matching `id`.
   *
   * @param elementReferenceMap id-based map of all instances of
   * `OntoumlElement` in the same context or project. */
  abstract resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;

  /** Support method the returns an instance of `OntoumlElement` from a element
   * map based on the reference's id throwing an broken reference exception in
   * case an element with matching id is not found in the map.
   *
   * @throws Error accusing broken reference if a element with matching id is
   * not found in the map */
  static resolveReference<T extends OntoumlElement>(
    reference: T,
    elementReferenceMap: Map<string, OntoumlElement>,
    container?: OntoumlElement,
    field?: string
  ): T {
    if (!reference) {
      return reference;
    }

    const elementId = reference?.id;
    const element = elementReferenceMap.get(elementId) as T;

    if (element) {
      return element;
    } else {
      const message =
        container && field
          ? `Could not resolve broken reference '${field}' in ${container.constructor.name} '${container.id}'.`
          : `Could not resolve broken reference.`;
      throw new Error(message);
    }
  }
}

function setFieldAsConstant(element: OntoumlElement, type: OntoumlType) {
  Object.defineProperty(element, 'type', {
    value: type,
    enumerable: true,
    writable: false,
    configurable: false
  });
}
