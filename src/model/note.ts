import {
  OntoumlType,
  ModelElement,
  MultilingualText,
  Project,
  OntoumlElement,
  Package,
} from "..";
import { PackageableElement } from "./packageable_element";

export class Note extends ModelElement implements PackageableElement {
  text: MultilingualText;

  constructor(project: Project) {
    super(project);
    this.text = new MultilingualText();
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.NOTE,
      text: this.text.toJSON(),
    };

    return { ...object, ...super.toJSON() };
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  clone(): OntoumlElement {
    throw new Error("Method not implemented.");
  }

  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error("Method not implemented.");
  }
}
