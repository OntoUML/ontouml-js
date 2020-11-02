import { OntoumlType } from '@constants/.';
import { Relation, Class, Classifier, ModelElement, setContainer, Package } from './';

const generalizationTemplate = {
  general: null,
  specific: null
};

export class Generalization extends ModelElement {
  general: Classifier;
  specific: Classifier;

  constructor(base?: Partial<Generalization>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.GENERALIZATION_TYPE, enumerable: true });
  }

  toJSON(): any {
    const generalizationSerialization: any = {};

    Object.assign(generalizationSerialization, generalizationTemplate, super.toJSON());

    const general = this.general as Class | Relation;
    const specific = this.specific as Class | Relation;
    generalizationSerialization.general = general.getReference();
    generalizationSerialization.specific = specific.getReference();

    return generalizationSerialization;
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }
}
