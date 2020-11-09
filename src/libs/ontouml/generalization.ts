import {
  Relation,
  Class,
  Classifier,
  ModelElement,
  setContainer,
  Package,
  GeneralizationSet,
  OntoumlType,
  ClassifierType
} from './';

export class Generalization extends ModelElement {
  general: Classifier<ClassifierType>;
  specific: Classifier<ClassifierType>;

  constructor(base?: Partial<Generalization>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.GENERALIZATION_TYPE, enumerable: true });
  }

  toJSON(): any {
    const generalizationSerialization: any = {
      general: null,
      specific: null
    };

    Object.assign(generalizationSerialization, super.toJSON());

    const general = this.general as ClassifierType;
    const specific = this.specific as ClassifierType;
    generalizationSerialization.general = general.getReference();
    generalizationSerialization.specific = specific.getReference();

    return generalizationSerialization;
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizationSets()
      .filter((genset: GeneralizationSet) => genset.generalizations && genset.generalizations.includes(this));
  }

  involvesClasses(): boolean {
    return this.general instanceof Class && this.specific instanceof Class;
  }

  involvesRelations(): boolean {
    return this.general instanceof Relation && this.specific instanceof Relation;
  }

  clone(): Generalization {
    return new Generalization(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    if (this.general === (originalElement as ClassifierType)) {
      this.general = newElement as ClassifierType;
    }

    if (this.specific === (originalElement as ClassifierType)) {
      this.specific = newElement as ClassifierType;
    }
  }
}
