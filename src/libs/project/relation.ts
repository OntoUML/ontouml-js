import { ClassStereotype, OntoumlType, RelationStereotype } from '@constants/.';
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
  stereotypes
} from './';
import { UNBOUNDED_CARDINALITY } from './property';

const relationTemplate = {
  stereotypes: null,
  properties: null,
  isAbstract: false,
  isDerived: false
};

export class Relation extends ModelElement implements Container<Property, Property>, Decoratable<RelationStereotype>, Classifier {
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

  toJSON(): any {
    const relationSerialization = {};

    Object.assign(relationSerialization, relationTemplate, super.toJSON());

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

  isInstantiation(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.INSTANTIATION;
  }

  isDerivation(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.DERIVATION;
  }

  isMaterial(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.MATERIAL;
  }

  isComparative(): boolean {
    return this.getUniqueStereotype() === RelationStereotype.COMPARATIVE;
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

  getSource(): Classifier {
    return this.getSourceEnd().propertyType;
  }

  getTarget(): Classifier {
    return this.getTargetEnd().propertyType;
  }

  getMember(position: number): Classifier {
    return this.getMemberEnd(position).propertyType;
  }

  getSourceClass(): Class {
    if (this.isDerivation()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getSource() as Class;
  }

  getTargetClass(): Class {
    if (this.isDerivation()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getTarget() as Class;
  }

  getMemberClass(position: number): Class {
    if (this.isDerivation()) {
      throw new Error('Unable to retrieve class from derivation relation');
    }
    return this.getMember(position) as Class;
  }

  getDerivingRelation(): Relation {
    if (!this.isDerivation()) {
      throw new Error('Unable to retrieve deriving relation from non-derivation relation');
    }
    // TODO: review code; getSource won't work
    return this.getSource() as Relation;
  }

  getDerivedClass(): Class {
    if (!this.isDerivation()) {
      throw new Error('Unable to retrieve derived class from non-derivation relation');
    }
    // TODO: review code; getTarget won't work
    return this.getTarget() as Class;
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
  isBinary(): boolean {
    return this.properties && this.properties.length === 2;
  }

  // TODO: check whether isTernaryRelation() is a better name
  isTernary(): boolean {
    return this.properties && this.properties.length > 2;
  }

  isPartWholeRelation(): boolean {
    return this.isBinary() && this.getTargetEnd().isAggregationEnd();
  }

  holdsBetween(...conditions: ((relationEnd: Property) => boolean)[]): boolean {
    if (this.properties.length !== conditions.length) {
      throw new Error('Method requires a same number conditions and relation ends');
    }
    return this.properties.every((relationEnd: Property, relationEndIndex: number) => conditions[relationEndIndex](relationEnd));
  }

  holdsBetweenEvents(): boolean {
    if (!this.isBinary() || this.isDerivation()) {
      return false;
    }

    const isEndTypeAnEvent = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isEvent();
    return this.holdsBetween(isEndTypeAnEvent, isEndTypeAnEvent);
  }

  holdsBetweenMoments(): boolean {
    if (!this.isBinary() || this.isDerivation()) {
      return false;
    }

    const isEndTypeAMoment = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isMoment();
    return this.holdsBetween(isEndTypeAMoment, isEndTypeAMoment);
  }

  holdsBetweenSubstantials(): boolean {
    if (!this.isBinary() || this.isDerivation()) {
      return false;
    }

    const isEndTypeASubstantial = (relationEnd: Property) =>
      relationEnd.propertyType instanceof Class && relationEnd.propertyType.isSubstantial();
    return this.holdsBetween(isEndTypeASubstantial, isEndTypeASubstantial);
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

  getGeneralizationAsGeneral(): Generalization[] {
    throw new Error('Method unimplemented!');
  }

  getGeneralizationAsSpecific(): Generalization[] {
    throw new Error('Method unimplemented!');
  }

  getFilteredAncestors(filter: (ancestor: Classifier) => boolean): Classifier[] {
    throw new Error('Method not implemented.');
  }
  getFilteredDescendants(filter: (descendent: Classifier) => boolean): Classifier[] {
    throw new Error('Method not implemented.');
  }

  getParents(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getChildren(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAncestors(knownAncestors: Relation[]): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getDescendants(knownDescendants: Relation[]): Relation[] {
    throw new Error('Method unimplemented!');
  }

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
  getDerivedRelation?: () => Relation;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is a derivation relation (see `isDerivation()`).
   */
  getTruthmakerClass(): Class {
    throw new Error('Method unimplemented!');
  }

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
