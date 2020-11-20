import {
  Property,
  ModelElement,
  setContainer,
  Generalization,
  Classifier,
  Class,
  Decoratable,
  getUniqueStereotype,
  hasValidStereotypeValue,
  Container,
  getAllContents,
  getContents,
  Package,
  stereotypes,
  ClassStereotype,
  RelationStereotype,
  classifier,
  GeneralizationSet,
  UNBOUNDED_CARDINALITY,
  hasStereotypeContainedIn,
  OntoumlType
} from './';

export class Relation extends ModelElement
  implements Container<Property, Property>, Decoratable<RelationStereotype>, Classifier<Relation> {
  stereotypes: RelationStereotype[];
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;

  constructor(base?: Partial<Relation>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.RELATION_TYPE, enumerable: true });

    this.isAbstract = this.isAbstract || false;
    this.isDerived = this.isDerived || false;
  }

  getGeneralizations(): Generalization[] {
    return classifier.getGeneralizationsInvolvingClassifier(this);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return classifier.getGeneralizationSetsInvolvingClassifier(this);
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return classifier.getGeneralizationsWhereGeneral(this);
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return classifier.getGeneralizationsWhereSpecific(this);
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return classifier.getGeneralizationSetsWhereGeneral(this);
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return classifier.getGeneralizationSetsWhereSpecific(this);
  }

  getParents(): Relation[] {
    return classifier.getParents(this);
  }

  getChildren(): Relation[] {
    return classifier.getChildren(this);
  }

  getAncestors(): Relation[] {
    return classifier.getAncestors<Relation>(this);
  }

  getDescendants(): Relation[] {
    return classifier.getDescendants<Relation>(this);
  }

  getFilteredAncestors(filter: (ancestor: Relation) => boolean): Relation[] {
    return classifier.getFilteredAncestors(this, filter);
  }

  getFilteredDescendants(filter: (descendent: Relation) => boolean): Relation[] {
    return classifier.getFilteredDescendants(this, filter);
  }

  getContents(contentsFilter?: (property: Property) => boolean): Property[] {
    return getContents(this, ['properties'], contentsFilter);
  }

  getAllContents(contentsFilter?: (property: Property) => boolean): Property[] {
    return getAllContents(this, ['properties'], contentsFilter);
  }

  getUniqueStereotype(): RelationStereotype {
    return getUniqueStereotype(this);
  }

  hasValidStereotypeValue(): boolean {
    return hasValidStereotypeValue(this, stereotypes.RelationStereotypes, true);
  }

  hasStereotypeContainedIn(stereotypes: RelationStereotype | RelationStereotype[]): boolean {
    return hasStereotypeContainedIn<RelationStereotype>(this, stereotypes);
  }

  toJSON(): any {
    const relationSerialization = {
      stereotypes: null,
      properties: null,
      isAbstract: false,
      isDerived: false
    };

    Object.assign(relationSerialization, super.toJSON());

    return relationSerialization;
  }

  createSourceEnd(base?: Partial<Property>): Property {
    this.properties = this.properties || [];

    if (this.properties[0]) {
      throw new Error('Source already defined');
    }

    const sourceEnd = new Property({ ...base, container: this, project: this.project });

    this.properties[0] = sourceEnd;

    return sourceEnd;
  }

  createTargetEnd(base?: Partial<Property>): Property {
    this.properties = this.properties || [];

    if (this.properties[1]) {
      throw new Error('Target already defined');
    }

    const targetEnd = new Property({ ...base, container: this, project: this.project });

    this.properties[1] = targetEnd;

    return targetEnd;
  }

  createMemberEnd(base?: Partial<Property>, position: number = 0): Property {
    this.properties = this.properties || [];

    if (this.properties[position]) {
      throw new Error('Member already defined in this position');
    }

    const memberEnd = new Property({ ...base, container: this, project: this.project });

    this.properties[position] = memberEnd;

    return memberEnd;
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  getSourceEnd(): Property {
    if (!this.isBinaryRelation()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getTargetEnd(): Property {
    if (!this.isBinaryRelation()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getMemberEnd(position: number): Property {
    if (!this.isTernaryRelation()) {
      throw new Error('Unable to retrieve member end on a non-ternary relation');
    }
    return this.properties[position];
  }

  getSourceClassEnd(): Property {
    if (!this.isBinaryClassRelation()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getTargetClassEnd(): Property {
    if (!this.isBinaryClassRelation()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getDerivingRelationEnd(): Property {
    if (!this.isDerivationRelation()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getDerivedClassEnd(): Property {
    if (!this.isDerivationRelation()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getMemberClassEnd(position: number): Property {
    if (!this.isTernaryClassRelation()) {
      throw new Error('Unable to retrieve member end on a non-ternary relation');
    }
    return this.properties[position];
  }

  getSource(): Classifier<any> {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getSourceEnd().propertyType;
  }

  getTarget(): Classifier<any> {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getTargetEnd().propertyType;
  }

  getMember(position: number): Classifier<any> {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getMemberClassEnd(position).propertyType;
  }

  getSourceClass(): Class {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getSourceEnd().propertyType as Class;
  }

  getTargetClass(): Class {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getTargetEnd().propertyType as Class;
  }

  getMemberClass(position: number): Class {
    if (this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getMemberClassEnd(position).propertyType as Class;
  }

  getDerivingRelation(): Relation {
    if (!this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve deriving relation from non-derivation relation');
    }
    return this.getDerivingRelationEnd().propertyType as Relation;
  }

  getDerivedClass(): Class {
    if (!this.hasDerivationStereotype()) {
      throw new Error('Unable to retrieve derived class from non-derivation relation');
    }
    return this.getDerivedClassEnd().propertyType as Class;
  }

  getSourceClassStereotype(): ClassStereotype {
    return this.getSourceClass().getUniqueStereotype();
  }

  getTargetClassStereotype(): ClassStereotype {
    return this.getTargetClass().getUniqueStereotype();
  }

  getMemberClassStereotype(position: number): ClassStereotype {
    return this.getMemberClass(position).getUniqueStereotype();
  }

  getDerivingRelationStereotype(): RelationStereotype {
    return this.getDerivingRelation().getUniqueStereotype();
  }

  getDerivedClassStereotype(): ClassStereotype {
    return this.getDerivedClass().getUniqueStereotype();
  }

  // TODO: check whether isBinaryRelation() is a better name
  isBinaryRelation(): boolean {
    return this.properties[0].propertyType instanceof Class && this.properties[1].propertyType instanceof Class;
  }

  // TODO: check whether isTernaryRelation() is a better name
  isTernaryRelation(): boolean {
    return this.properties && this.properties.length > 2;
  }

  isBinaryClassRelation(): boolean {
    return (
      this.isBinaryRelation() &&
      this.properties[0].propertyType instanceof Class &&
      this.properties[1].propertyType instanceof Class
    );
  }

  // TODO: check whether isDerivationRelation() is a better name
  isDerivationRelation(): boolean {
    return (
      this.isBinaryRelation() &&
      this.properties[0].propertyType instanceof Relation &&
      this.properties[1].propertyType instanceof Class
    );
  }

  isTernaryClassRelation(): boolean {
    return (
      this.isTernaryRelation() && this.properties.every((relationEnd: Property) => relationEnd.propertyType instanceof Class)
    );
  }

  isPartWholeRelation(): boolean {
    return this.isBinaryRelation() && this.getTargetEnd().isAggregationEnd();
  }

  // TODO: check weather ternary relations may denote existential dependencies
  isExistentialDependency(): boolean {
    return this.properties.some((relationEnd: Property) => relationEnd.isReadOnly);
  }

  isBounded(): boolean {
    // TODO: change comparison for a regex to allow letters (as variables) in the cardinalities
    const isBoundedEnd = (relationEnd: Property) =>
      relationEnd.cardinality && relationEnd.cardinality.upperBound !== UNBOUNDED_CARDINALITY;
    return this.properties && this.properties.every(isBoundedEnd);
  }

  isSourceExistentiallyDependent(): boolean {
    return this.getTargetEnd().isReadOnly;
  }

  isTargetExistentiallyDependent(): boolean {
    return this.getSourceEnd().isReadOnly;
  }

  isExistentialDependenceRelation(): boolean {
    return this.isSourceExistentiallyDependent() || this.isTargetExistentiallyDependent();
  }

  hasExistentialDependenceStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.ExistentialDependencyRelationStereotypes.includes(stereotype);
  }

  hasPartWholeStereotype(): boolean {
    const stereotype = this.getUniqueStereotype();
    return stereotypes.ExistentialDependencyRelationStereotypes.includes(stereotype);
  }

  hasMaterialStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.MATERIAL;
  }

  hasDerivationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.DERIVATION;
  }

  hasComparativeStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.COMPARATIVE;
  }

  hasMediationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.MEDIATION;
  }

  hasCharacterizationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.CHARACTERIZATION;
  }

  hasExternalDependenceStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.EXTERNAL_DEPENDENCE;
  }

  hasComponentOfStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.COMPONENT_OF;
  }

  hasMemberOfStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.MEMBER_OF;
  }

  hasSubCollectionOfStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.SUBCOLLECTION_OF;
  }

  hasSubQuantityOfStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.SUBQUANTITY_OF;
  }

  hasInstantiationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.INSTANTIATION;
  }

  hasTerminationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.TERMINATION;
  }

  hasParticipationalStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.PARTICIPATIONAL;
  }

  hasParticipationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.PARTICIPATION;
  }

  hasHistoricalDependenceStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.HISTORICAL_DEPENDENCE;
  }

  hasCreationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.CREATION;
  }

  hasManifestationStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.MANIFESTATION;
  }

  hasBringsAboutStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.BRINGS_ABOUT;
  }

  hasTriggersStereotype(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.TRIGGERS;
  }

  holdsBetween(...conditions: ((relationEnd: Property) => boolean)[]): boolean {
    if (this.properties.length !== conditions.length) {
      throw new Error('Method requires a same number conditions and relation ends');
    }
    return this.properties.every((relationEnd: Property, relationEndIndex: number) => conditions[relationEndIndex](relationEnd));
  }

  holdsBetweenEvents(): boolean {
    if (!this.isBinaryClassRelation() || this.isDerivationRelation()) {
      return false;
    }

    const isEndTypeAnEvent = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isRestrictedToEvent();
    return this.holdsBetween(isEndTypeAnEvent, isEndTypeAnEvent);
  }

  holdsBetweenMoments(): boolean {
    if (!this.isBinaryClassRelation() || this.isDerivationRelation()) {
      return false;
    }

    const isEndTypeAMoment = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isRestrictedToMoment();
    return this.holdsBetween(isEndTypeAMoment, isEndTypeAMoment);
  }

  holdsBetweenSubstantials(): boolean {
    if (!this.isBinaryClassRelation() || this.isDerivationRelation()) {
      return false;
    }

    const isEndTypeASubstantial = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isRestrictedToSubstantial();
    return this.holdsBetween(isEndTypeASubstantial, isEndTypeASubstantial);
  }

  clone(): Relation {
    const clone = new Relation(this);

    if (clone.properties) {
      clone.properties = clone.properties.map((attribute: Property) => attribute.clone());
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents().forEach((content: ModelElement) => content.replace(originalElement, newElement));
  }

  // getGeneralizationAsGeneral(): Generalization[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getGeneralizationAsSpecific(): Generalization[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getFilteredAncestors(filter: (ancestor: Classifier) => boolean): Classifier[] {
  //   throw new Error('Method not implemented.');
  // }
  // getFilteredDescendants(filter: (descendent: Classifier) => boolean): Classifier[] {
  //   throw new Error('Method not implemented.');
  // }

  // getParents(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getChildren(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAncestors(knownAncestors: Relation[]): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getDescendants(knownDescendants: Relation[]): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getRelations(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  /**
   * Returns `true` if the relation is binary and relates two IClass objects
   */
  // isBinary?: () => boolean;

  /**
   * Returns `true` if the relation is ternary and relates multiple IClass objects
   */
  // isTernary?: () => boolean;

  /**
   * Returns `true` if the relation is binary and relates an IRelation object to an IClass object
   */
  // isDerivation?: () => boolean;

  /**
   * Returns the `propertyType` of `properties[0]` if the relation is binary (see `isBinary()`).
   */
  // getSource?: () => Class;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is binary (see `isBinary()`).
   */
  // getTarget?: () => Class;

  /**
   * Returns the `propertyType` of `properties[0]` if the relation is a derivation relation (see `isDerivation()`).
   */
  // getDerivedRelation?: () => Relation;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is a derivation relation (see `isDerivation()`).
   */
  // getTruthmakerClass(): Class {
  //   throw new Error('Method unimplemented!');
  // }

  // TODO: support specific methods for binary, nary, and derivations, throwing exception when otherwise

  getMediatedClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getMediatedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getRelatorClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getRelatorEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  // Applies only to characterization
  getBearerClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getBearerEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getInheringClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getInheringEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  // All part-whole relations and parthood without stereotypes
  getPartClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getPartEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getWholeClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getWholeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getDependedClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getDependedEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getDependentClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getDependentEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getTypeClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getTypeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getInstanceClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getInstanceEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEventClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getEventEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getEndurantClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getEndurantEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  getSituationClass(): Class {
    throw new Error('Method unimplemented!');
  }

  getSituationEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  // TODO: Bring in the relevant relations from Class
}
