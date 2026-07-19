import {
  OntoumlType,
  Class,
  Classifier,
  Generalization,
  Package,
  Relation,
  Project,
  ModelElement
} from '..';

/**
 * A group of {@link Generalization} instances that share a common general
 * classifier, over which disjointness and completeness constraints can be
 * asserted. For example, the generalizations of `Person` into `Child` and
 * `Adult` may be grouped into a disjoint and complete generalization set,
 * stating that every person is either a child or an adult, and never both
 * at the same time.
 *
 * A generalization set may also refer to a categorizer: a high-order
 * {@link Class} whose instances are the specific classifiers of the set.
 */
export class GeneralizationSet extends ModelElement {
  /**
   * Indicates whether the specifics of this set have no common instances,
   * i.e., whether the specializations are mutually exclusive.
   */
  isDisjoint: boolean = false;

  /**
   * Indicates whether every instance of the general classifier is an
   * instance of at least one specific of this set.
   */
  isComplete: boolean = false;

  /**
   * A high-order class whose instances are the specific classifiers of this
   * set, e.g., a class `AgePhase` categorizing `Child` and `Adult`.
   */
  categorizer?: Class;

  _generalizations: Set<Generalization> = new Set();

  constructor(project: Project) {
    super(project);
  }

  /** The generalizations grouped in this generalization set. */
  public get generalizations(): Generalization[] {
    return [...this._generalizations];
  }

  /**
   * Sets the generalizations grouped in this generalization set, detaching
   * any previously grouped generalizations.
   */
  public set generalizations(generalizations: Generalization[]) {
    this._generalizations.forEach(g => this.removeGeneralization(g));
    generalizations.forEach(g => this.addGeneralization(g));
  }

  /** Adds a generalization to this generalization set. */
  public addGeneralization(g: Generalization): void {
    this._generalizations.add(g);
    g._generalizationSets.add(this);
  }

  /** Removes a generalization from this generalization set. */
  public removeGeneralization(g: Generalization): void {
    this._generalizations.delete(g);
    g._generalizationSets.delete(this);
  }

  /** The package that contains this generalization set, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  /**
   * Detaches the generalizations grouped in this set — the generalizations
   * themselves are preserved — in addition to the reference clean-up
   * performed for every model element.
   */
  protected override removeReferences(): void {
    this.generalizations.forEach(g => this.removeGeneralization(g));
    super.removeReferences();
  }

  /**
   * Checks whether this generalization set is a partition, i.e., whether it
   * is both disjoint and complete.
   */
  isPartition(): boolean {
    return this.isComplete && this.isDisjoint;
  }

  /**
   * Checks whether this generalization set is a phase partition: a
   * partition of classes in which either every specific is a «phase» and
   * the general is a sortal, or every specific is a «phaseMixin» and the
   * general is a «category».
   */
  isPhasePartition(): boolean {
    if (!this.isPartition() || !this.involvesClasses()) {
      return false;
    }

    const general = this.getGeneralAsClass();
    const specifics = this.getSpecificsAsClasses();

    return (
      (general.isSortal() && specifics.every(s => s.isPhase())) ||
      (general.isCategory() && specifics.every(s => s.isPhaseMixin()))
    );
  }

  /**
   * Checks whether this generalization set is a subkind partition: a
   * partition of classes in which every specific is a «subkind» and the
   * general is a sortal.
   */
  isSubkindPartition(): boolean {
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      this.getGeneralAsClass().isSortal() &&
      this.getSpecificsAsClasses().every(s => s.isSubkind())
    );
  }

  /**
   * Retrieves the classifier that is the common general of all
   * generalizations in this set.
   *
   * @throws an error if the set is empty or if its generalizations have
   *         distinct generals.
   */
  getGeneral(): Classifier<any, any> {
    this.assertDefinedGeneralizations();
    this.assertUniqueGeneral();

    return this.generalizations[0].general!;
  }

  /**
   * Retrieves the specific classifiers of the generalizations in this set,
   * without duplicates.
   */
  getSpecifics(): Classifier<any, any>[] {
    if (!Array.isArray(this.generalizations)) {
      throw new Error(
        'The field `generalizations` should be an array: ' +
          this.generalizations
      );
    }

    let specifics = this.generalizations.map(g => g.specific);

    return Array.from(new Set(specifics));
  }

  /**
   * Retrieves the common general of this set as a {@link Class}.
   *
   * @throws an error if the set does not involve classes.
   */
  getGeneralAsClass(): Class {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getGeneral() as Class;
  }

  /**
   * Retrieves the specifics of this set as {@link Class} instances.
   *
   * @throws an error if the set does not involve classes.
   */
  getSpecificsAsClasses(): Class[] {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getSpecifics() as Class[];
  }

  /**
   * Retrieves the common general of this set as a {@link Relation}.
   *
   * @throws an error if the set does not involve relations.
   */
  getGeneralAsRelation(): Relation {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getGeneral() as Relation;
  }

  /**
   * Retrieves the specifics of this set as {@link Relation} instances.
   *
   * @throws an error if the set does not involve relations.
   */
  getSpecificsAsRelations(): Relation[] {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getSpecifics() as Relation[];
  }

  /**
   * Retrieves every classifier involved in this generalization set: the
   * general, the specifics, and the categorizer, when present.
   */
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

  /**
   * Checks whether every generalization in this set connects two
   * {@link Class} instances.
   *
   * @throws an error if the set is empty.
   */
  involvesClasses(): boolean {
    this.assertDefinedGeneralizations();
    return this.generalizations.every(g => g.involvesClasses());
  }

  /**
   * Checks whether every generalization in this set connects two
   * {@link Relation} instances.
   *
   * @throws an error if the set is empty.
   */
  involvesRelations(): boolean {
    this.assertDefinedGeneralizations();
    return this.generalizations.every(g => g.involvesRelations());
  }

  /**
   * Asserts that all generalizations in this set share the same general
   * classifier.
   *
   * @throws an error if the set involves distinct generals.
   */
  assertUniqueGeneral() {
    const general = this.generalizations[0].general;
    const hasMultipleGenerals = this.generalizations.some(
      g => g.general !== general
    );

    if (hasMultipleGenerals) {
      throw new Error(
        'Generalization set involving distinct general classifiers'
      );
    }

    return general;
  }

  /**
   * Asserts that this set contains at least one generalization.
   *
   * @throws an error if the set is empty or its generalizations are not
   *         defined.
   */
  assertDefinedGeneralizations() {
    if (!this.generalizations) {
      throw new Error('Generalization array is null.');
    }

    if (this.generalizations.length == 0) {
      throw new Error('Generalization array is empty.');
    }
  }

  /**
   * Retrieves the «instantiation» relations whose target is the categorizer
   * of this set, or `undefined` when the set has no categorizer.
   */
  getInstantiationRelations(): Relation[] | undefined {
    return this.categorizer
      ?.getIncomingRelations()
      .filter(r => r.isInstantiation());
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.GENERALIZATION_SET,
      isDisjoint: this.isDisjoint,
      isComplete: this.isComplete,
      categorizer: this.categorizer?.id || null,
      generalizations: this.generalizations.map(g => g.id)
    };

    return { ...super.toJSON(), ...object };
  }
}
