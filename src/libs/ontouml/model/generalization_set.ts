import { OntoumlElement, OntoumlType, Class, Classifier, Generalization, ModelElement, Package, Relation } from '..';

export class GeneralizationSet extends ModelElement {
  isDisjoint: boolean;
  isComplete: boolean;
  categorizer: Class;
  generalizations: Generalization[];

  constructor(base?: Partial<GeneralizationSet>) {
    super(OntoumlType.GENERALIZATION_SET_TYPE, base);

    this.isDisjoint = base?.isDisjoint ?? false;
    this.isComplete = base?.isComplete ?? false;
    this.categorizer = base?.categorizer ?? null;
    this.generalizations = base?.generalizations ?? null;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  /**
   * A disjoint complete set of subclasses
   */
  isPartition(): boolean {
    return this.isComplete && this.isDisjoint;
  }

  isPhasePartition(): boolean {
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      ((this.getSpecificClasses().every(specific => specific.hasPhaseStereotype()) &&
        this.getGeneralClass().hasSortalStereotype()) ||
        (this.getSpecificClasses().every(specific => specific.hasPhaseMixinStereotype()) &&
          this.getGeneralClass().hasCategoryStereotype()))
      //
    );
  }

  isSubkindPartition(): boolean {
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      ((this.getSpecificClasses().every(specific => specific.hasSubkindStereotype()) &&
        this.getGeneralClass().hasSortalStereotype()))
      //
    );
  }

  /**
   * @throws exception if different generals are present
   */
  getGeneral(): Classifier<any, any> {
    if (!this.generalizations) {
      return null;
    }

    let general = this.generalizations[0].general;

    if (this.generalizations.some((gen: Generalization) => gen.general !== general)) {
      throw new Error('Generalization set involving distinct general classifiers');
    }

    return general;
  }

  getSpecifics(): Classifier<any, any>[] {
    if (this.generalizations) {
      let specifics = this.generalizations.map((gen: Generalization) => gen.specific);
      return [...new Set(specifics)];
    }

    return [];
  }

  getGeneralClass(): Class {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getGeneral() as Class;
  }

  getSpecificClasses(): Class[] {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getSpecifics() as Class[];
  }

  getGeneralRelation(): Relation {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getGeneral() as Relation;
  }

  getSpecificRelations(): Relation[] {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getSpecifics() as Relation[];
  }

  getInvolvedClassifiers(): Classifier<any, any>[] {
    let involvedClassifiers: Classifier<any, any>[] = [];
    const general = this.getGeneral();
    const specifics = this.getSpecifics();

    if (this.categorizer) {
      involvedClassifiers.push(this.categorizer);
    }
    if (general) {
      involvedClassifiers.push(general);
    }
    if (specifics) {
      involvedClassifiers.push(...specifics);
    }

    return involvedClassifiers;
  }

  /** Collects specifics from all input generalization sets. Removes duplicates. */
  static collectSpecifics(generalizations: Generalization[]): Classifier<any, any>[] {
    let specifics = generalizations.map(g => g.specific);
    return [...new Set(specifics)];
  }

  /** Collects generalizations from all input generalization sets. Removes duplicates. */
  static collectGeneralizations(genSets: GeneralizationSet[]): Generalization[] {
    let generalizations = genSets.flatMap(gs => gs.generalizations);
    return [...new Set(generalizations)];
  }

  involvesClasses(): boolean {
    return this.generalizations && this.generalizations.every((gen: Generalization) => gen.involvesClasses());
  }

  involvesRelations(): boolean {
    return this.generalizations && this.generalizations.every((gen: Generalization) => gen.involvesRelations());
  }

  clone(): GeneralizationSet {
    return new GeneralizationSet(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    if (this.categorizer === originalElement) {
      this.categorizer = newElement as Class;
    }

    if (this.generalizations && this.generalizations.includes(originalElement as any)) {
      this.generalizations = this.generalizations.map((gen: Generalization) =>
        gen === originalElement ? (newElement as Generalization) : gen
      );
    }
  }

  /** Get instantiation relations where the categorizer (or one of its ancestors) is the source */
  getInstantiationRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  toJSON(): any {
    const object: any = {
      isDisjoint: false,
      isComplete: false,
      categorizer: null,
      generalizations: null
    };

    Object.assign(object, super.toJSON());

    object.categorizer = this.categorizer && this.categorizer.getReference();
    object.generalizations = this.generalizations
      ? [...this.generalizations].map((generalization: Generalization) => generalization.getReference())
      : null;

    return object;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    super.resolveReferences(elementReferenceMap);

    const { categorizer, generalizations } = this;

    if (categorizer) {
      this.categorizer = OntoumlElement.resolveReference(categorizer, elementReferenceMap, this, 'categorizer');
    }

    if (Array.isArray(generalizations)) {
      this.generalizations = generalizations.map((generalization: Generalization) =>
        OntoumlElement.resolveReference(generalization, elementReferenceMap, this, 'generalizations')
      );
    }
  }
}
