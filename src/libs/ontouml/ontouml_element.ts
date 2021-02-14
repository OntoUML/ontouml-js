import uniqid from 'uniqid';
import _ from 'lodash';
import { OntoumlType } from './ontouml_type';
import { MultilingualText } from './multilingual_text';
import { Project } from './project';

export abstract class OntoumlElement {
  type: OntoumlType;
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  project: Project;
  container: OntoumlElement;

  constructor(type: string, base?: Partial<OntoumlElement>) {
    this.id = uniqid();

    // if base has an id, the generated one is overwritten
    if (base) {
      Object.assign(this, base);
    }

    console.log(this);
    console.log(base);

    this.name = this.name || null;
    this.description = this.description || null;
    this.project = this.project || null;
    this.container = this.container || null;

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
    this.name.addText(value, language);
  }

  getDescription(language?: string): string {
    return this.description.getText(language);
  }

  addDescription(value: string, language?: string): void {
    this.description.addText(value, language);
  }

  getNameOrId(language?: string): string {
    return this.getName(language) || this.id;
  }

  public getReference(): { type: OntoumlType; id: string } {
    return {
      type: this.type,
      id: this.id
    };
  }

  setContainer(container: OntoumlElement): void {
    this.container = container;
    let project: Project = container != null ? container.project : null;
    this.setProject(project);
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
}
