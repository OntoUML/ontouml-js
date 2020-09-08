import { ModelElement } from './ModelElement';
import { Generalization } from './Generalization';
import { Property } from './Property';
import { OntoUMLType, OntologicalNature, ClassStereotype } from '@constants/.';
import { Literal } from './Literal';
import { Relation } from './Relation';
import { IDecoratable } from './IDecoratable';
import { Classifier } from './Classifier';

export class Class extends Classifier implements IDecoratable {
  type: OntoUMLType.CLASS_TYPE;
  allowed: null | string[]; // The type here needs to be string because of the serialization (same a stereotypes)
  stereotypes: null | string[];
  properties: Property[];
  literals: null | Literal[];
  isAbstract: boolean;
  isDerived: boolean;

  isExtensional: null | boolean;
  isPowertype: null | boolean;
  order: null | number;

  _typeOf?: Property[]; // inverse relation to Property.propertyType when it is an attribute

  constructor(ClassStereotype, base?: object) {
    super();
    throw new Error('Class unimplemented');
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

  /**
   * Always return an array, even if empty
   *
   * Looks only among ancestors
   */
  getUltimateSortals(): Class[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Always return an array, even if empty
   *
   * Looks below among descents and side trees
   */
  // TODO: review names
  getUltimateSortalsBelow(): Class[] {
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
}
