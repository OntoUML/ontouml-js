import {
  Property,
  ModelElement,
  Generalization,
  Classifier,
  Class,
  Decoratable,
  decoratableUtils,
  Container,
  containerUtils,
  Package,
  stereotypesUtils,
  ClassStereotype,
  RelationStereotype,
  classifierUtils,
  GeneralizationSet,
  OntoumlType
} from './';

export class Relation extends ModelElement
  implements Container<Property, Property>, Decoratable<RelationStereotype>, Classifier<Relation> {
  stereotype: RelationStereotype;
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;

  constructor(base?: Partial<Relation>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.RELATION_TYPE, enumerable: true });

    this.properties = this.properties || null;
    this.stereotype = this.stereotype || null;

    this.isAbstract = this.isAbstract || false;
    this.isDerived = this.isDerived || false;
  }

  getGeneralizations(): Generalization[] {
    return classifierUtils.getGeneralizationsInvolvingClassifier(this);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return classifierUtils.getGeneralizationSetsInvolvingClassifier(this);
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return classifierUtils.getGeneralizationsWhereGeneral(this);
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return classifierUtils.getGeneralizationsWhereSpecific(this);
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return classifierUtils.getGeneralizationSetsWhereGeneral(this);
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return classifierUtils.getGeneralizationSetsWhereSpecific(this);
  }

  getParents(): Relation[] {
    return classifierUtils.getParents(this);
  }

  getChildren(): Relation[] {
    return classifierUtils.getChildren(this);
  }

  getAncestors(): Relation[] {
    return classifierUtils.getAncestors<Relation>(this);
  }

  getDescendants(): Relation[] {
    return classifierUtils.getDescendants<Relation>(this);
  }

  getFilteredAncestors(filter: (ancestor: Relation) => boolean): Relation[] {
    return classifierUtils.getFilteredAncestors(this, filter);
  }

  getFilteredDescendants(filter: (descendent: Relation) => boolean): Relation[] {
    return classifierUtils.getFilteredDescendants(this, filter);
  }

  getContents(contentsFilter?: (property: Property) => boolean): Property[] {
    return containerUtils.getContents(this, ['properties'], contentsFilter);
  }

  getAllContents(contentsFilter?: (property: Property) => boolean): Property[] {
    return containerUtils.getAllContents(this, ['properties'], contentsFilter);
  }

  hasValidStereotypeValue(): boolean {
    return decoratableUtils.hasValidStereotypeValue<RelationStereotype>(this, stereotypesUtils.RelationStereotypes, true);
  }

  hasStereotypeContainedIn(stereotypes: RelationStereotype | RelationStereotype[]): boolean {
    return decoratableUtils.hasStereotypeContainedIn<RelationStereotype>(this, stereotypes);
  }

  toJSON(): any {
    const relationSerialization = {
      stereotype: null,
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

  /**
   * Create member end at designated position. If no position is informed, append the member end at the last position.
   *
   * @param position - position to place the member end; optional
   * @param base - partial property object to base the new member end; optional
   * */
  createMemberEnd(position?: number, base?: Partial<Property>): Property {
    this.properties = this.properties || [];
    position = position || position === 0 ? position : this.properties.length;

    if (typeof position !== 'number' || position < 0) {
      throw new Error(`Invalid position value: ${position}`);
    }

    if (this.properties[position]) {
      throw new Error('Member already defined in this position');
    }

    const memberEnd = new Property({ ...base, container: this, project: this.project });
    position = position;

    this.properties[position] = memberEnd;

    return memberEnd;
  }

  setContainer(newContainer: Package): void {
    containerUtils.setContainer(this, newContainer, 'contents', true);
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
    return this.getSourceEnd().propertyType;
  }

  getTarget(): Classifier<any> {
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

  getSourceStereotype(): ClassStereotype {
    return (this.getSource() as any).stereotype;
  }

  getTargetStereotype(): ClassStereotype {
    return (this.getTarget() as any).stereotype;
  }

  getSourceClassStereotype(): ClassStereotype {
    return this.getSourceClass().stereotype;
  }

  getTargetClassStereotype(): ClassStereotype {
    return this.getTargetClass().stereotype;
  }

  getMemberClassStereotype(position: number): ClassStereotype {
    return this.getMemberClass(position).stereotype;
  }

  getDerivingRelationStereotype(): RelationStereotype {
    return this.getDerivingRelation().stereotype;
  }

  getDerivedClassStereotype(): ClassStereotype {
    return this.getDerivedClass().stereotype;
  }

  // TODO: check whether isBinaryRelation() is a better name
  isBinaryRelation(): boolean {
    return this.properties && this.properties.length === 2;
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
    const stereotype = this.stereotype;
    return stereotypesUtils.ExistentialDependencyRelationStereotypes.includes(stereotype);
  }

  hasMaterialStereotype(): boolean {
    return this.stereotype === RelationStereotype.MATERIAL;
  }

  hasDerivationStereotype(): boolean {
    return this.stereotype === RelationStereotype.DERIVATION;
  }

  hasComparativeStereotype(): boolean {
    return this.stereotype === RelationStereotype.COMPARATIVE;
  }

  hasMediationStereotype(): boolean {
    return this.stereotype === RelationStereotype.MEDIATION;
  }

  hasCharacterizationStereotype(): boolean {
    return this.stereotype === RelationStereotype.CHARACTERIZATION;
  }

  hasExternalDependenceStereotype(): boolean {
    return this.stereotype === RelationStereotype.EXTERNAL_DEPENDENCE;
  }

  hasComponentOfStereotype(): boolean {
    return this.stereotype === RelationStereotype.COMPONENT_OF;
  }

  hasMemberOfStereotype(): boolean {
    return this.stereotype === RelationStereotype.MEMBER_OF;
  }

  hasSubCollectionOfStereotype(): boolean {
    return this.stereotype === RelationStereotype.SUBCOLLECTION_OF;
  }

  hasSubQuantityOfStereotype(): boolean {
    return this.stereotype === RelationStereotype.SUBQUANTITY_OF;
  }

  hasInstantiationStereotype(): boolean {
    return this.stereotype === RelationStereotype.INSTANTIATION;
  }

  hasTerminationStereotype(): boolean {
    return this.stereotype === RelationStereotype.TERMINATION;
  }

  hasParticipationalStereotype(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATIONAL;
  }

  hasParticipationStereotype(): boolean {
    return this.stereotype === RelationStereotype.PARTICIPATION;
  }

  hasHistoricalDependenceStereotype(): boolean {
    return this.stereotype === RelationStereotype.HISTORICAL_DEPENDENCE;
  }

  hasCreationStereotype(): boolean {
    return this.stereotype === RelationStereotype.CREATION;
  }

  hasManifestationStereotype(): boolean {
    return this.stereotype === RelationStereotype.MANIFESTATION;
  }

  hasBringsAboutStereotype(): boolean {
    return this.stereotype === RelationStereotype.BRINGS_ABOUT;
  }

  hasTriggersStereotype(): boolean {
    return this.stereotype === RelationStereotype.TRIGGERS;
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

  // All part-whole relations and parthood without stereotype
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
