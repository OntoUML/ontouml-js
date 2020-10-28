import ModelElement from './model_element';
import Property from './property';
import Generalization from './generalization';
import Classifier from './classifier';
import Class from './class';
import { OntoumlType, RelationStereotype } from '@constants/.';
import Decoratable, { getUniqueStereotype, hasValidStereotype } from './decoratable';
import Container, { getAllContents, getContents } from './container';

const relationTemplate = {
  stereotypes: null,
  properties: null,
  isAbstract: false,
  isDerived: false
};

export default class Relation extends ModelElement
  implements Container<Property, Property>, Decoratable<RelationStereotype>, Classifier {
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

  getContents(): Set<Property> {
    return getContents(this, ['properties']);
  }

  getAllContents(): Set<Property> {
    return getAllContents(this, ['properties']);
  }

  getUniqueStereotype(): RelationStereotype {
    return getUniqueStereotype(this);
  }

  hasValidStereotype(): boolean {
    return hasValidStereotype(this, Object.values(RelationStereotype), true);
  }

  toJSON(): any {
    const relationSerialization = {};

    Object.assign(relationSerialization, relationTemplate, super.toJSON());

    return relationSerialization;
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
  isBinary?: () => boolean;

  /**
   * Returns `true` if the relation is ternary and relates multiple IClass objects
   */
  isTernary?: () => boolean;

  /**
   * Returns `true` if the relation is binary and relates an IRelation object to an IClass object
   */
  isDerivation?: () => boolean;

  /**
   * Returns the `propertyType` of `properties[0]` if the relation is binary (see `isBinary()`).
   */
  getSource?: () => Class;

  /**
   * Returns the `propertyType` of `properties[1]` if the relation is binary (see `isBinary()`).
   */
  getTarget?: () => Class;

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
