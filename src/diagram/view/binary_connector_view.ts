import { ModelElement, View, Path, Shape } from '../..';

export abstract class BinaryConnectorView<
  T extends ModelElement
> extends View<T> {
  source: View<any>;
  target: View<any>;
  path: Path;

  constructor(element: T, source: View<any>, target: View<any>) {
    super(element);

    this.path = new Path();
    this.source = source;
    this.target = target;
  }

  override get shapes(): Shape[] {
    return [this.path];
  }

  override toJSON(): any {
    return {
      ...super.toJSON(),
      sourceView: this.source.id,
      targetView: this.target.id,
      path: this.path.id
    };
  }
}
