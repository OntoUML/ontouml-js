import { Classifier } from "../../model/classifier";
import { DecoratableBuilder } from "./decoratable_builder";

export class PropertyBuilder extends DecoratableBuilder {
   classifier: Classifier<any, any>;

   constructor(classifier: Classifier<any, any>) {
      super(classifier.project)
      this.classifier = classifier;
   }
   
}

