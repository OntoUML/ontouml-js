import { Classifier, Package, Stereotype, DecoratableBuilder } from '../..';

export abstract class ClassifierBuilder<
  B extends ClassifierBuilder<B, S>,
  S extends Stereotype
> extends DecoratableBuilder<B, S> {
  protected override element?: Classifier<any, any>;
  override _container?: Package;
  protected _isAbstract: boolean = false;

  override build(): Classifier<any, any> {
    this.assertElement();

    this.element!.isAbstract = this._isAbstract;
    this._container?.addContent(this.element!);

    super.build();
    return this.element!;
  }

  abstract(): B {
    this._isAbstract = true;
    return this as unknown as B;
  }

  concrete(): B {
    this._isAbstract = false;
    return this as unknown as B;
  }

  container(pkg: Package): B {
    this._container = pkg;
    return this as unknown as B;
  }
}
