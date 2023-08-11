import {
  OntoumlType,
  ModelElement,
  MultilingualText,
  Project,
  OntoumlElement,
} from '..';

export class Note extends ModelElement {
  text: MultilingualText;
  
  constructor(project: Project) {
    super(OntoumlType.NOTE), project;
    this.text = new MultilingualText();
  }
  
  toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE,
      text: null
    };

    Object.assign(object, super.toJSON());

    return object;
  }
  
  getContents(): OntoumlElement[] {
    return [];
  }
  
  clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }
  
  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }

}
