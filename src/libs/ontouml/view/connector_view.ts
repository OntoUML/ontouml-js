import { ModelElement, ElementView, Path } from '..';

export abstract class ConnectorView<T extends ModelElement> extends ElementView<T, Path> {
  source: ElementView<any, any>;
  target: ElementView<any, any>;

  constructor(type: string, base?: Partial<ConnectorView<T>>) {
    super(type, base);

    this.source = base?.source || null;
    this.target = base?.target || null;
  }

  createShape(): Path {
    return new Path();
  }
}
