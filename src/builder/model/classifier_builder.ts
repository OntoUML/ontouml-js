import { Classifier } from '../../model/classifier';
import { Stereotype } from '../../model/stereotypes';
import { DecoratableBuilder } from './decoratable_builder';

export abstract class ClassifierBuilder<
  B extends ClassifierBuilder<B, S>,
  S extends Stereotype
> extends DecoratableBuilder<B, S> {
  protected override element?: Classifier<any, any>;
  protected _isAbstract: boolean = false;

  override build(): Classifier<any, any> {
    super.build();

    this.assertElement();
    this.element!.isAbstract = this._isAbstract;

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
}
