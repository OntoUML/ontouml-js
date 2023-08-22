import { Stereotype } from "../../model/stereotypes";
import { ModelElementBuilder } from "./model_element_builder";

export abstract class DecoratableBuilder<B extends DecoratableBuilder<B,S>, S extends Stereotype> extends ModelElementBuilder<B> {
   protected _stereotype?: S;
   protected _isDerived: boolean = false;

   derived(): B {
      this._isDerived = true;
      return this as unknown as B;
   }

   // TODO: consider replacing with "nonDerived"
   base(): B {
      this._isDerived = false;
      return this as unknown as B;
   }
   
   stereotype(stereotype:string|S):B {
      this._stereotype = stereotype as any;
      return this as unknown as B;
   }
}

