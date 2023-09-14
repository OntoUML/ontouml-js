import {
  OntoumlType,
  ModelElement,
  MultilingualText,
  Project,
  OntoumlElement,
  Package
} from '..';

export class Note extends ModelElement {
  text: MultilingualText;

  constructor(project: Project) {
    super(project);
    this.text = new MultilingualText();
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE,
      text: this.text.toJSON()
    };

    return { ...super.toJSON(), ...object };
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
