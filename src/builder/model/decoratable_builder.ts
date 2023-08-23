import { Decoratable } from "../../model/decoratable";
import { Stereotype } from "../../model/stereotypes";
import { ModelElementBuilder } from "./model_element_builder";

export abstract class DecoratableBuilder<
  B extends DecoratableBuilder<B, S>,
  S extends Stereotype,
> extends ModelElementBuilder<B> {
  protected override element?: Decoratable<any>;
  protected _stereotype?: S;
  protected _isDerived: boolean = false;

  build(): Decoratable<any> {
    super.build();

    this.assertElement();
    this.element!.stereotype = this._stereotype;

    return this.element!;
  }

  derived(): B {
    this._isDerived = true;
    return this as unknown as B;
  }

  nonDerived(): B {
    this._isDerived = false;
    return this as unknown as B;
  }

  stereotype(stereotype: string | S): B {
    this._stereotype = stereotype as any;
    return this as unknown as B;
  }
}
