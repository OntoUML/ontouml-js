import { ModelElement, View, Path, Project } from '..';

export abstract class BinaryConnectorView<T extends ModelElement> extends View<T> {
  source: View<any>;
  target: View<any>;
  path: Path;

  constructor(element: T, source: View<any>, target: View<any>) {
    super(element);

    this.path = new Path();
    this.source = source;
    this.target = target;
  }

  override toJSON(): any {
    const object : any = {
      source: this.source.id,
      target: this.target.id,
      path: this.path.id
    };

    return {...object, ...super.toJSON()};
  }

}
