import { OntoumlType, Package, View, OntoumlElement } from '..';
import { Rectangle } from '../shape/rectangle';

export class PackageView extends View<Package> {
  readonly rectangle: Rectangle;

  constructor(pkg: Package) {
    super(pkg);

    this.rectangle = new Rectangle();
    this.rectangle.width = 60;
    this.rectangle.height = 30;
  }
  
  override getContents(): OntoumlElement[] {
    return [this.rectangle];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PACKAGE_VIEW,
      rectangle: this.rectangle.id
    };
    
    return { ...object, ...super.toJSON() };
  }
}
