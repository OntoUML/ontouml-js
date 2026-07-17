import {
  OntoumlType,
  ModelElement,
  Project,
  OntoumlElement,
  Package,
  Note,
  ProjectElement
} from '..';

export class Anchor extends ModelElement {
  note: Note;
  element: ModelElement;

  constructor(project: Project, note: Note, element: ModelElement) {
    super(project);
    this.note = note;
    this.element = element;
  }

  public override get container(): Package | undefined {
    return this._container as Package;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.ANCHOR,
      note: this.note.id,
      element: this.element.id
    };

    return { ...super.toJSON(), ...object };
  }
}
