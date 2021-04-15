import uniqid from 'uniqid';
import _ from 'lodash';
import { OntoumlType, MultilingualText, Project } from '.';

export abstract class OntoumlElement {
  type: OntoumlType;
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  project: Project;
  container: OntoumlElement;

  constructor(type: string, base?: Partial<OntoumlElement>) {
    this.id = base?.id || uniqid();
    this.project = base?.project || null;
    this.container = base?.container || null;

    if (typeof base?.name === 'string') {
      this.name = new MultilingualText(base.name);
    } else if (base?.name instanceof MultilingualText) {
      this.name = base.name;
    } else {
      this.name = new MultilingualText();
    }

    if (typeof base?.description === 'string') {
      this.description = new MultilingualText(base.description);
    } else if (base?.description instanceof MultilingualText) {
      this.description = base.description;
    } else {
      this.description = new MultilingualText();
    }

    Object.defineProperty(this, 'type', {
      value: type,
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  getName(language?: string): string {
    return this.name.getText(language);
  }

  addName(value: string, language?: string): void {
    if (!this.name) this.name = new MultilingualText();
    this.name.addText(value, language);
  }

  setName(value: string, language?: string): void {
    this.name = new MultilingualText(value);
  }

  getDescription(language?: string): string {
    return this.description.getText(language);
  }

  addDescription(value: string, language?: string): void {
    if (!this.description) this.description = new MultilingualText();
    this.description.addText(value, language);
  }

  setDescription(value: string, language?: string): void {
    this.description = new MultilingualText(value);
  }

  getNameOrId(language?: string): string {
    return this.getName(language) || this.id;
  }

  getReference(): { type: OntoumlType; id: string } {
    return {
      type: this.type,
      id: this.id
    };
  }

  setContainer(container: OntoumlElement): void {
    this.container = container;
    this.setProject(container?.project);
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

  abstract getContents(): OntoumlElement[];

  toJSON(): any {
    const object = {
      type: null,
      id: null,
      name: null,
      description: null
    };

    Object.assign(object, this);

    delete object['project'];
    delete object['container'];

    Object.entries(object).forEach(([k, v]) => {
      if (Array.isArray(v) && _.isEmpty(v)) {
        object[k] = null;
      }
    });

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
