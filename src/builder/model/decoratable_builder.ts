import { Stereotype } from "../model/stereotypes";
import { ModelElementBuilder } from "./model_element_builder";

export class DecoratableBuilder extends ModelElementBuilder {
   stereotype?: Stereotype
   isDerived: boolean = false;
   
}

