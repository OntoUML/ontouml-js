import { OntoumlElement, OntoumlType, Class, Classifier, Generalization, ModelElement, Package, Relation } from '..';

export class GeneralizationSet extends ModelElement {
  isDisjoint: boolean;
  isComplete: boolean;
  categorizer?: Class;
  generalizations: Generalization[];

  constructor(base?: Partial<GeneralizationSet>) {
    super(OntoumlType.GENERALIZATION_SET, base);

    this.isDisjoint = base?.isDisjoint ?? false;
    this.isComplete = base?.isComplete ?? false;
    this.categorizer = base?.categorizer;
    this.generalizations = base?.generalizations ?? [];
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
      ((this.getSpecificsAsClasses().every(specific => specific.isPhase()) &&
        this.getGeneralAsClass().isSortal()) ||
        (this.getSpecificsAsClasses().every(specific => specific.isPhaseMixin()) &&
          this.getGeneralAsClass().isCategory()))
    );
  }

  isSubkindPartition(): boolean {
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      ((this.getSpecificsAsClasses().every(specific => specific.isSubkind()) &&
        this.getGeneralAsClass().isSortal()))
      //
    );
  }

  /**
   * @throws exception if different generals are present
   */
  getGeneral(): Classifier<any, any> {
    this.assertDefinedGeneralizations();
    this.assertUniqueGeneral();

    return this.generalizations[0].general!;
  }
  
  getSpecifics(): Classifier<any, any>[] {
    if(!Array.isArray(this.generalizations)) {
      throw new Error("The field `generalizations` should be an array: " + this.generalizations);
    }
    
    this.generalizations.forEach(g => g.assertSpecificDefined());
    let specifics = this.generalizations.map(g => g.specific as Classifier<any, any>);                                
    
    return Array.from(new Set(specifics));
  }

  getGeneralAsClass(): Class {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getGeneral() as Class;
  }

  getSpecificsAsClasses(): Class[] {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getSpecifics() as Class[];
  }

  getGeneralAsRelation(): Relation {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getGeneral() as Relation;
  }

  getSpecificsAsRelations(): Relation[] {
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

  involvesClasses(): boolean {
    this.assertDefinedGeneralizations();
    return this.generalizations.every(g => g.involvesClasses());
  }

  involvesRelations(): boolean {
    this.assertDefinedGeneralizations();
    return this.generalizations.every(g => g.involvesRelations());
  }

  assertUniqueGeneral() {
    const general = this.generalizations[0].general;
    const hasMultipleGenerals = this.generalizations.some(g => g.general !== general);
    
    if (hasMultipleGenerals) {
      throw new Error('Generalization set involving distinct general classifiers');
    }

    return general;
  }
  
  assertDefinedGeneralizations() {
    if (!this.generalizations) {
      throw new Error("Generalization array is null.");
    }
    
    if (this.generalizations.length == 0) {
      throw new Error("Generalization array is empty.");
    }

    this.generalizations.every(g => g.assertFieldsDefined());
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
      type: OntoumlType.GENERALIZATION_SET,
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
