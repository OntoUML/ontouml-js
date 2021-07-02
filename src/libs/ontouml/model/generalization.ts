import { OntoumlElement, OntoumlType, Class, Classifier, GeneralizationSet, ModelElement, Package, Relation } from '..';

export class Generalization extends ModelElement {
  general: Classifier<any, any>;
  specific: Classifier<any, any>;
  generalizationSets: Set<GeneralizationSet>;

  constructor(base?: Partial<Generalization>) {
    super(OntoumlType.GENERALIZATION_TYPE, base);

    this.general = base?.general || null;
    this.specific = base?.specific || null;
    this.generalizationSets = new Set<GeneralizationSet>();

    this.deriveFields();
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return [...this.generalizationSets];
    // return this.getModelOrRootPackage()
    //   .getAllGeneralizationSets()
    //   .filter((genset: GeneralizationSet) => genset.generalizations && genset.generalizations.includes(this));
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

    if (this.general === originalElement) {
      this.general = newElement as Classifier<any, any>;
    }

    if (this.specific === originalElement) {
      this.specific = newElement as Classifier<any, any>;
    }
  }

  getGeneralClass(): Class {
    if (this.general instanceof Class) {
      return this.general;
    } else {
      throw new Error("The generalization's general is not an instance of Class.");
    }
  }

  getGeneralRelation(): Relation {
    if (this.general instanceof Relation) {
      return this.general;
    } else {
      throw new Error("The generalization's general is not an instance of Relation.");
    }
  }

  getSpecificClass(): Class {
    if (this.specific instanceof Class) {
      return this.specific;
    } else {
      throw new Error("The generalization's specific is not an instance of Class.");
    }
  }

  getSpecificRelation(): Relation {
    if (this.specific instanceof Relation) {
      return this.specific;
    } else {
      throw new Error("The generalization's specific is not an instance of Relation.");
    }
  }

  setSpecific(classifier: Classifier<any, any>): void {
    this.specific.generalizationsAsSpecific.delete(this);
    this.specific = classifier;
    classifier.generalizationsAsSpecific.add(this);
  }

  setGeneral(classifier: Classifier<any, any>): void {
    this.specific.generalizationsAsGeneral.delete(this);
    this.specific = classifier;
    classifier.generalizationsAsGeneral.add(this);
  }

  toJSON(): any {
    const generalizationSerialization: any = {
      general: null,
      specific: null
    };

    Object.assign(generalizationSerialization, super.toJSON());

    const general = this.general;
    const specific = this.specific;
    generalizationSerialization.general = general ? general.getReference() : null;
    generalizationSerialization.specific = specific ? specific.getReference() : null;

    return generalizationSerialization;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    super.resolveReferences(elementReferenceMap);

    const { general, specific } = this;

    if (general) {
      this.general = OntoumlElement.resolveReference(general, elementReferenceMap, this, 'general');
    }

    if (specific) {
      this.specific = OntoumlElement.resolveReference(specific, elementReferenceMap, this, 'specific');
    }
  }

  deriveFields(): void {
    this?.specific?.generalizationsAsSpecific.add(this);
    this?.general?.generalizationsAsGeneral.add(this);
  }
}
