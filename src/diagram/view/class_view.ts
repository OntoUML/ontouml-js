import { Class, Rectangle, OntoumlType, View, Shape } from '../..';

export class ClassView extends View<Class> {
  readonly rectangle: Rectangle;

  constructor(clazz: Class) {
    super(clazz);

    this.rectangle = new Rectangle();
    this.rectangle.width = 100;
    this.rectangle.height = 50;
  }

  override get shapes(): Shape[] {
    return [this.rectangle];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.CLASS_VIEW,
      ...super.toJSON(),
      rectangle: this.rectangle.id
    };
  }
}
