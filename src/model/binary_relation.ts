import {
  OntoumlType,
  Project,
  RelationStereotype,
  Property,
  Class,
  Relation,
  Classifier,
  EXISTENTIAL_DEPENDENCE_STEREOTYPES
} from '..';

/**
 * A {@link Relation} with exactly two ends: a source and a target. Binary
 * relations account for most relations in OntoUML models, from domain
 * relations such as a «material» `married with` between instances of
 * `Person`, to reified dependencies such as a «mediation» between a relator
 * (e.g., `Marriage`) and the endurants it binds (e.g., the spouses).
 *
 * Besides the generic end-access API inherited from {@link Relation}, this
 * class offers stereotype-specific accessors (e.g., {@link getRelator},
 * {@link getTruthmaker}, {@link getBearer}) that expose the roles played by
 * the connected classifiers according to the relation's stereotype.
 */
export class BinaryRelation extends Relation {
  constructor(
    project: Project,
    source: Classifier<any, any>,
    target: Classifier<any, any>
  ) {
    super(project, [source, target]);
  }

  /** The relation end at the source (first) position. */
  public get sourceEnd(): Property {
    return this._properties[0];
  }

  /** The relation end at the target (second) position. */
  public get targetEnd(): Property {
    return this._properties[1];
  }

  /** The classifier connected at the source end, if typed. */
  public get source(): Classifier<any, any> | undefined {
    return this.sourceEnd.propertyType;
  }

  /** The classifier connected at the target end, if typed. */
  public get target(): Classifier<any, any> | undefined {
    return this.targetEnd.propertyType;
  }

  /**
   * Asserts that the source end of the relation is typed.
   *
   * @throws an error if the source end has no type.
   */
  assertTypedSource() {
    if (!this.source) {
      throw new Error(
        'The type of the source end of the relation is undefined.'
      );
    }
  }

  /**
   * Asserts that the target of the relation is a {@link Class}.
   *
   * @throws an error if the target is not a class.
   */
  assertTargetAsClass() {
    if (!this.isTargetClass()) {
      throw new Error('The target of the relation is not a class.');
    }
  }

  /**
   * Asserts that the target end of the relation is typed.
   *
   * @throws an error if the target end has no type.
   */
  assertTypedTarget() {
    if (!this.target) {
      throw new Error(
        'The type of the target end of the relation is undefined.'
      );
    }
  }

  /**
   * Asserts that the source of the relation is a {@link Class}.
   *
   * @throws an error if the source is not a class.
   */
  assertSourceAsClass() {
    if (!this.isSourceClass()) {
      throw new Error('The target of the relation is not a class.');
    }
  }

  /**
   * Asserts that the relation connects a {@link Relation} (source) to a
   * {@link Class} (target), as in «derivation» relations.
   *
   * @throws an error if the relation does not connect a relation to a class.
   */
  assertFromRelationToClass() {
    if (!this.fromRelationToClass()) {
      throw new Error('The relation does not connect a relation to a class.');
    }
  }

  /**
   * Lists the stereotypes that OntoUML allows on binary relations, i.e.,
   * all values of {@link RelationStereotype}.
   */
  getAllowedStereotypes(): RelationStereotype[] {
    return Object.values(RelationStereotype);
  }

  /**
   * Checks whether the source of the relation is a {@link Class}.
   *
   * @throws an error if the source end has no type.
   */
  isSourceClass(): boolean {
    this.assertTypedSource();
    return this.source instanceof Class;
  }

  /**
   * Checks whether the target of the relation is a {@link Class}.
   *
   * @throws an error if the target end has no type.
   */
  isTargetClass(): boolean {
    this.assertTypedTarget();
    return this.target instanceof Class;
  }

  /**
   * Retrieves the source of the relation as a {@link Class}.
   *
   * @throws an error if the source is not a class.
   */
  getSourceAsClass(): Class {
    this.assertSourceAsClass();
    return this.source as Class;
  }

  /**
   * Retrieves the target of the relation as a {@link Class}.
   *
   * @throws an error if the target is not a class.
   */
  getTargetAsClass(): Class {
    this.assertTargetAsClass();
    return this.target as Class;
  }

  /**
   * Checks whether the relation is a parthood (part-whole) relation between
   * classes, i.e., whether its target end is decorated with an aggregation
   * kind (shared or composite) while its source end is not.
   */
  isPartWholeRelation(): boolean {
    return (
      this.holdsBetweenClasses() &&
      this.targetEnd.isWholeEnd() &&
      !this.sourceEnd.isWholeEnd()
    );
  }

  /**
   * Checks whether the relation connects a {@link Relation} (source) to a
   * {@link Class} (target), as in «derivation» relations.
   */
  fromRelationToClass(): boolean {
    return this.source instanceof Relation && this.target instanceof Class;
  }

  /** Checks whether this relation is stereotyped as «derivation». */
  isDerivation(): boolean {
    return this.stereotype === RelationStereotype.DERIVATION;
  }

  /** Checks whether this relation is stereotyped as «comparative». */
  isComparative(): boolean {
    return this.stereotype === RelationStereotype.COMPARATIVE;
  }

  /** Checks whether this relation is stereotyped as «mediation». */
  isMediation(): boolean {
    return this.stereotype === RelationStereotype.MEDIATION;
  }

  /** Checks whether this relation is stereotyped as «characterization». */
  isCharacterization(): boolean {
    return this.stereotype === RelationStereotype.CHARACTERIZATION;
  }

  /** Checks whether this relation is stereotyped as «externalDependence». */
  isExternalDependence(): boolean {
    return this.stereotype === RelationStereotype.EXTERNAL_DEPENDENCE;
  }

  /** Checks whether this relation is stereotyped as «componentOf». */
  isComponentOf(): boolean {
    return this.stereotype === RelationStereotype.COMPONENT_OF;
  }

  /** Checks whether this relation is stereotyped as «memberOf». */
  isMemberOf(): boolean {
    return this.stereotype === RelationStereotype.MEMBER_OF;
  }

  /** Checks whether this relation is stereotyped as «subCollectionOf». */
  isSubCollectionOf(): boolean {
    return this.stereotype === RelationStereotype.SUBCOLLECTION_OF;
  }

  /** Checks whether this relation is stereotyped as «subQuantityOf». */
  isSubQuantityOf(): boolean {
    return this.stereotype === RelationStereotype.SUBQUANTITY_OF;
  }

  /** Checks whether this relation is stereotyped as «instantiation». */
  isInstantiation(): boolean {
    return this.stereotype === RelationStereotype.INSTANTIATION;
  }

  /** Checks whether this relation is stereotyped as «termination». */
  isTermination(): boolean {
    return this.stereotype === RelationStereotype.TERMINATION;
  }

  /** Checks whether this relation is stereotyped as «participational». */
  isParticipational(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATIONAL;
  }

  /** Checks whether this relation is stereotyped as «participation». */
  isParticipation(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATION;
  }

  /** Checks whether this relation is stereotyped as «historicalDependence». */
  isHistoricalDependence(): boolean {
    return this.stereotype === RelationStereotype.HISTORICAL_DEPENDENCE;
  }

  /** Checks whether this relation is stereotyped as «creation». */
  isCreation(): boolean {
    return this.stereotype === RelationStereotype.CREATION;
  }

  /** Checks whether this relation is stereotyped as «manifestation». */
  isManifestation(): boolean {
    return this.stereotype === RelationStereotype.MANIFESTATION;
  }

  /** Checks whether this relation is stereotyped as «bringsAbout». */
  isBringsAbout(): boolean {
    return this.stereotype === RelationStereotype.BRINGS_ABOUT;
  }

  /** Checks whether this relation is stereotyped as «triggers». */
  isTriggers(): boolean {
    return this.stereotype === RelationStereotype.TRIGGERS;
  }

  /**
   * Checks whether this relation is decorated with a stereotype that
   * implies existential dependence between the entities it connects (see
   * {@link EXISTENTIAL_DEPENDENCE_STEREOTYPES}).
   */
  hasDependenceStereotype(): boolean {
    if (!this.stereotype) return false;

    return EXISTENTIAL_DEPENDENCE_STEREOTYPES.includes(this.stereotype);
  }

  /**
   * Checks whether this relation expresses existential dependence between
   * the entities it connects, indicated by a read-only end: the entity at
   * the opposite end depends on the entity at the read-only end.
   */
  isExistentialDependence(): boolean {
    return this.sourceEnd.isReadOnly || this.targetEnd.isReadOnly;
  }

  /**
   * Retrieves the relation whose instances are derived from the truthmaker,
   * i.e., the relation at the source of this «derivation» relation.
   *
   * @throws an error if this relation is not a «derivation» from a relation
   *         to a class.
   */
  getDerivedRelation(): Relation {
    return this.getDerivedRelationEnd().propertyType as Relation;
  }

  /**
   * Retrieves the end of this «derivation» relation that is typed by the
   * derived relation.
   *
   * @throws an error if this relation is not a «derivation» from a relation
   *         to a class.
   */
  getDerivedRelationEnd(): Property {
    this.assertFromRelationToClass();

    if (!this.isDerivation()) {
      throw new Error('The relation is not a «derivation».');
    }

    return this.properties[0];
  }

  /**
   * Retrieves the class whose instances are the truthmakers of the derived
   * relation (e.g., the relator class `Marriage` for a derived `married
   * with` relation).
   *
   * @throws an error if this relation is not a «derivation» from a relation
   *         to a class.
   */
  getTruthmaker(): Class {
    return this.getTruthmakerEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «derivation» relation that is typed by the
   * truthmaker class.
   *
   * @throws an error if this relation is not a «derivation» from a relation
   *         to a class.
   */
  getTruthmakerEnd(): Property {
    this.assertFromRelationToClass();

    if (!this.isDerivation()) {
      throw new Error('The relation is not a «derivation».');
    }

    return this.properties[1];
  }

  /**
   * Retrieves the class whose instances are mediated by the relator, i.e.,
   * the target of this «mediation» relation.
   *
   * @throws an error if this relation is not a «mediation» or its target is
   *         not a class.
   */
  getMediatedClass(): Class {
    return this.getMediatedEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «mediation» relation that is typed by the
   * mediated class.
   *
   * @throws an error if this relation is not a «mediation» or its target is
   *         not a class.
   */
  getMediatedEnd(): Property {
    if (!this.isMediation()) {
      throw new Error('The relation is not a «mediation».');
    }

    this.assertTargetAsClass();

    return this.targetEnd;
  }

  /**
   * Retrieves the relator class of this «mediation» relation, i.e., its
   * source.
   *
   * @throws an error if this relation is not a «mediation» or its source is
   *         not a relator type.
   */
  getRelator(): Class {
    return this.getRelatorEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «mediation» relation that is typed by the
   * relator class.
   *
   * @throws an error if this relation is not a «mediation» or its source is
   *         not a relator type.
   */
  getRelatorEnd(): Property {
    if (!this.isMediation()) {
      throw new Error('The relation is not a «mediation».');
    }

    if (!this.getSourceAsClass().isRelatorType()) {
      throw new Error('The source of the relation is not a relator type.');
    }

    return this.sourceEnd;
  }

  /**
   * Retrieves the class whose instances bear the characterizing moment,
   * i.e., the target of this «characterization» relation.
   *
   * @throws an error if this relation is not a «characterization» or its
   *         target is not a class.
   */
  getBearer(): Class {
    return this.getBearerEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «characterization» relation that is typed by
   * the bearer class.
   *
   * @throws an error if this relation is not a «characterization» or its
   *         target is not a class.
   */
  getBearerEnd(): Property {
    if (!this.isCharacterization()) {
      throw new Error('The relation is not a «characterization».');
    }

    this.assertTargetAsClass();

    return this.targetEnd;
  }

  /**
   * Retrieves the mode or quality class that characterizes the bearer,
   * i.e., the source of this «characterization» relation.
   *
   * @throws an error if this relation is not a «characterization» or its
   *         source is not a mode or quality type.
   */
  getCharacterizer(): Class {
    return this.getCharacterizerEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «characterization» relation that is typed by
   * the characterizing mode or quality class.
   *
   * @throws an error if this relation is not a «characterization» or its
   *         source is not a mode or quality type.
   */
  getCharacterizerEnd(): Property {
    if (!this.isCharacterization()) {
      throw new Error('The relation is not a «characterization».');
    }

    if (!this.getSourceAsClass().isCharacterizer()) {
      throw new Error(
        'The source of the relation is not a mode or quality type.'
      );
    }

    return this.sourceEnd;
  }

  // All part-whole relations and parthood without stereotype
  // whole is the target. part is the source.
  /**
   * Retrieves the part class of this part-whole relation, i.e., its source.
   * Applies to any parthood, stereotyped or not.
   *
   * @throws an error if this relation is not a part-whole relation.
   */
  getPart(): Class {
    return this.getPartEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this part-whole relation that is typed by the part
   * class, i.e., its source end.
   *
   * @throws an error if this relation is not a part-whole relation.
   */
  getPartEnd(): Property {
    if (!this.isPartWholeRelation()) {
      throw new Error('The object is not a part-whole relation.');
    }

    return this.sourceEnd;
  }

  /**
   * Retrieves the whole class of this part-whole relation, i.e., its
   * target. Applies to any parthood, stereotyped or not.
   *
   * @throws an error if this relation is not a part-whole relation.
   */
  getWholeClass(): Class {
    return this.getWholeEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this part-whole relation that is typed by the
   * whole class, i.e., its target end.
   *
   * @throws an error if this relation is not a part-whole relation.
   */
  getWholeEnd(): Property {
    if (!this.isPartWholeRelation()) {
      throw new Error('The object is not a part-whole relation.');
    }

    return this.targetEnd;
  }

  /**
   * Retrieves the class on which the dependent class depends in this
   * existential dependence relation.
   *
   * @throws currently unimplemented.
   */
  getDependedClass(): Class {
    return this.getDependedEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this existential dependence relation that is typed
   * by the depended class.
   *
   * @throws currently unimplemented.
   */
  getDependedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the class whose instances depend on the depended class in
   * this existential dependence relation.
   *
   * @throws currently unimplemented.
   */
  getDependentClass(): Class {
    return this.getDependentEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this existential dependence relation that is typed
   * by the dependent class.
   *
   * @throws currently unimplemented.
   */
  getDependentEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the high-order type of this «instantiation» relation.
   *
   * @throws currently unimplemented.
   */
  getTypeClass(): Class {
    return this.getTypeEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «instantiation» relation that is typed by the
   * high-order type.
   *
   * @throws currently unimplemented.
   */
  getTypeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the class whose instances instantiate the high-order type in
   * this «instantiation» relation.
   *
   * @throws currently unimplemented.
   */
  getInstanceClass(): Class {
    return this.getInstanceEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this «instantiation» relation that is typed by the
   * instantiated class.
   *
   * @throws currently unimplemented.
   */
  getInstanceEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the event class connected by this relation.
   *
   * @throws currently unimplemented.
   */
  getEventClass(): Class {
    return this.getEventEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this relation that is typed by an event class.
   *
   * @throws currently unimplemented.
   */
  getEventEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the endurant class connected by this relation.
   *
   * @throws currently unimplemented.
   */
  getEndurantClass(): Class {
    return this.getEndurantEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this relation that is typed by an endurant class.
   *
   * @throws currently unimplemented.
   */
  getEndurantEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the situation class connected by this relation.
   *
   * @throws currently unimplemented.
   */
  getSituationClass(): Class {
    return this.getSituationEnd().propertyType as Class;
  }

  /**
   * Retrieves the end of this relation that is typed by a situation class.
   *
   * @throws currently unimplemented.
   */
  getSituationEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.BINARY_RELATION
    };

    return { ...super.toJSON(), ...object };
  }
}
