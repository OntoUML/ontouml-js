import { OntoumlType, OntologicalNature, ClassStereotype, OntoumlStereotype } from '@constants/.';
import Relation from './relation';
import Property from './property';
import Literal from './literal';
import Decoratable, { getUniqueStereotype, hasValidStereotype } from './decoratable';
// import Classifier from './classifier';
import Container, { getAllContents, getContents } from './container';
import ModelElement from './model_element';
import Package from './package';

// TODO: implement Classifier

const classTemplate = {
  stereotypes: null,
  restrictedTo: null,
  literals: null,
  properties: null,
  isAbstract: false,
  isDerived: false,
  isExtensional: false,
  isPowertype: false,
  order: null
};

export default class Class extends ModelElement
  implements Decoratable<ClassStereotype>, Container<Property | Literal, Property | Literal> {
  container: Package;
  stereotypes: ClassStereotype[];
  restrictedTo: OntologicalNature[]; // The type here needs to be string because of the serialization (same a stereotypes)
  literals: Literal[];
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;
  isExtensional: boolean;
  isPowertype: boolean;
  order: string;
  // _typeOf?: Property[]; // inverse relation to Property.propertyType when it is an attribute

  constructor(base?: Partial<Class>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.CLASS_TYPE, enumerable: true });

    this.isAbstract = this.isAbstract || false;
    this.isDerived = this.isDerived || false;
    this.isExtensional = this.isExtensional || false;
    this.isPowertype = this.isPowertype || false;
    this.order = this.order || '1';
  }

  getContents(): Set<Property | Literal> {
    return getContents(this, ['properties', 'literals']);
  }

  getAllContents(): Set<Property | Literal> {
    return getAllContents(this, ['properties', 'literals']);
  }

  hasValidStereotype(): boolean {
    return hasValidStereotype(this, Object.values(ClassStereotype));
  }

  getUniqueStereotype(): ClassStereotype {
    return getUniqueStereotype(this);
  }

  toJSON(): any {
    const classSerialization = {};

    Object.assign(classSerialization, classTemplate, super.toJSON());

    return classSerialization;
  }

  getGeneralizationAsCategorizer(): Class {
    throw new Error('Method unimplemented!');
  }

  getParents(): Class[] {
    // return super.getParents() as Class[];
    throw new Error('Method unimplemented!');
  }

  getChildren(): Class[] {
    // return super.getChildren() as Class[];
    throw new Error('Method unimplemented!');
  }

  getAncestors(knownAncestors?: Class[]): Class[] {
    // return super.getAncestors() as Class[];
    throw new Error('Method unimplemented!');
  }

  getDescendants(knownDescendants?: Class[]): Class[] {
    // return super.getDescendants() as Class[];
    throw new Error('Method unimplemented!');
  }

  getFilteredAncestors(filter: (ancestor: Class) => boolean): Class[] {
    // return super.getFilteredAncestors(filter) as Class[]
    throw new Error('Method unimplemented!');
  }

  getFilteredDescendants(filter: (descendent: Class) => boolean): Class[] {
    // return super.getFilteredDescendants(filter) as Class[]
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasNature(nature: OntologicalNature | OntologicalNature[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Includes all
   */
  allowsNature(nature: OntologicalNature | OntologicalNature[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasRelatorNature(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Includes relator
   */
  allowsRelatorNature(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match (unique stereotypes only)
   */
  hasStereotype(stereotype: ClassStereotype): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param stereotypes True only if the class has exactly one stereotype which is included in the stereotypes array
   */
  hasOneOfStereotype(stereotypes: ClassStereotype[]): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasKindStereotype(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasRoleStereotype(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   *
   * @param nature Exact match
   */
  hasRelatorStereotype(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «role», «phase»
   */
  isSortal(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «category», «roleMixin», «phaseMixin», «mixin»
   */
  isNonSortal(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true if the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality»
   */
  isUltimateSortal(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true for «subkind», «role», «phase», and «historicalRole»
   */
  isBaseSortal(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «kind», «collective», «quantity», «relator», «mode», «quality», «subkind», «category»
   */
  isRigid(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «mixin»
   */
  isSemiRigid(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns true iff the class has one of the following stereotypes as its unique stereotype: «roleMixin», «phaseMixin», «role», «phase»
   */
  isAntiRigid(): boolean {
    throw new Error('Method unimplemented!');
  }

  getUltimateSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getUltimateSortalsDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Returns not only ancestors and descendants, but also those reachable through non-disjoint diverging branch in generalization hierarchies
   */
  getUltimateSortalsInReach(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSortalDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getNonSortalAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getNonSortalDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSemiRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getSemiRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAntiRigidAncestors(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAntiRigidDescendants(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getOwnRelations(filter?: Function): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllRelations(filter?: Function): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnIncomingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOutgoingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllIncomingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllOutgoingRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getAllNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getOwnDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getOwnAttributes(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllAttributes(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

  getAllLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

  isPrimitiveDataType(): boolean {
    throw new Error('Method unimplemented!');
  }

  // TODO: evaluate if these stereotype retrieval methods are necessary
  static getUltimateSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getNonSortalStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getAntiRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }

  static getSemiRigidStereotypes(): ClassStereotype[] {
    throw new Error('Method unimplemented!');
  }
}
