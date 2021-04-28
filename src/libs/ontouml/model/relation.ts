import {
  OntoumlElement,
  OntoumlType,
  Class,
  Classifier,
  ClassStereotype,
  RelationStereotype,
  ModelElement,
  Package,
  Property,
  stereotypeUtils
} from '..';

export class Relation extends Classifier<Relation, RelationStereotype> {
  constructor(base?: Partial<Relation>) {
    super(OntoumlType.RELATION_TYPE, base);
  }

  getContents(): OntoumlElement[] {
    return [...this.properties];
  }

  getAllowedStereotypes(): RelationStereotype[] {
    return stereotypeUtils.RelationStereotypes;
  }

  isStereotypeValid(allowsNone: boolean = true): boolean {
    return super.isStereotypeValid(allowsNone);
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

  getSourceEnd(): Property {
    if (!this.isBinary()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getTargetEnd(): Property {
    if (!this.isBinary()) {
      throw new Error('Unable to retrieve target end on a non-binary relation');
    }
    return this.properties[1];
  }

  getMemberEnd(position: number): Property {
    if (!this.isTernary()) {
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
    if (!this.isDerivation()) {
      throw new Error('Unable to retrieve source end on a non-binary relation');
    }
    return this.properties[0];
  }

  getDerivedClassEnd(): Property {
    if (!this.isDerivation()) {
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

  getSource(): Classifier<any, any> {
    return this.getSourceEnd().propertyType;
  }

  getTarget(): Classifier<any, any> {
    return this.getTargetEnd().propertyType;
  }

  getMembers(): Classifier<any, any>[] {
    let members = this.properties?.map(prop => prop.propertyType).filter(type => type !== null) || [];
    return [...new Set(members)];
  }

  getMember(position: number): Classifier<any, any> {
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
  isBinary(): boolean {
    return this.properties?.length === 2;
  }

  // TODO: check whether isTernaryRelation() is a better name
  isTernary(): boolean {
    return this.properties?.length > 2;
  }

  isBinaryClassRelation(): boolean {
    return this.isBinary() && this.getSource() instanceof Class && this.getTarget() instanceof Class;
  }

  // TODO: check whether isDerivationRelation() is a better name
  isDerivation(): boolean {
    return (
      this.isBinary() && this.properties[0].propertyType instanceof Relation && this.properties[1].propertyType instanceof Class
    );
  }

  isTernaryClassRelation(): boolean {
    return this.isTernary() && this.properties.every((relationEnd: Property) => relationEnd.propertyType instanceof Class);
  }

  isPartWholeRelation(): boolean {
    return this.isBinary() && this.getTargetEnd().isAggregationEnd();
  }

  isMediation(): boolean {
    return this.stereotype === RelationStereotype.MEDIATION;
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

  isBinaryExistentialDependency(): boolean {
    return this.isSourceExistentiallyDependent() || this.isTargetExistentiallyDependent();
  }

  hasExistentialDependencyStereotype(): boolean {
    const stereotype = this.stereotype;
    return stereotypeUtils.ExistentialDependencyRelationStereotypes.includes(stereotype);
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
    if (!this.isBinaryClassRelation() || this.isDerivation()) {
      return false;
    }

    const isEndTypeAnEvent = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isRestrictedToEvent();
    return this.holdsBetween(isEndTypeAnEvent, isEndTypeAnEvent);
  }

  holdsBetweenMoments(): boolean {
    if (!this.isBinaryClassRelation() || this.isDerivation()) {
      return false;
    }

    const isEndTypeAMoment = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isRestrictedToMoment();
    return this.holdsBetween(isEndTypeAMoment, isEndTypeAMoment);
  }

  holdsBetweenSubstantials(): boolean {
    if (!this.isBinaryClassRelation() || this.isDerivation()) {
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
