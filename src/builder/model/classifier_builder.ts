import { Classifier } from "../../model/classifier";
import { Stereotype } from "../../model/stereotypes";
import { DecoratableBuilder } from "./decoratable_builder";

export abstract class ClassifierBuilder<B extends ClassifierBuilder<B,S>, S extends Stereotype> extends DecoratableBuilder<B,S> {
  protected _isAbstract : boolean = false;

  abstract(): B {
    this._isAbstract = true;
    return this as unknown as B;
  }
 
  concrete(): B {
    this._isAbstract = false;
    return this as unknown as B;
  }
}

