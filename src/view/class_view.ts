import { Class, Rectangle, OntoumlElement, OntoumlType, View } from '..';

export class ClassView extends View<Class> {
  readonly rectangle: Rectangle;

  constructor(clazz: Class) {
    super(clazz);

    this.rectangle = new Rectangle();
    this.rectangle.width = 100;
    this.rectangle.height = 50;
  }

  override getContents(): OntoumlElement[] {
    return [this.rectangle];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.CLASS_VIEW,
      rectangle: this.rectangle.id
    };

    return { ...object, ...super.toJSON() };
  }
}
