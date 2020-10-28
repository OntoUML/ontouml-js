import { OntoumlType, AggregationKind, OntoumlStereotype, PropertyStereotype } from '@constants/.';
import ModelElement from './model_element';
import Classifier from './classifier';
import Decoratable, { getUniqueStereotype, hasValidStereotype } from './decoratable';
import Class from './class';
import Relation from './relation';

const propertyTemplate = {
  stereotypes: null,
  cardinality: null,
  propertyType: null,
  subsettedProperties: null,
  redefinedProperties: null,
  aggregationKind: null,
  isDerived: false,
  isOrdered: false,
  isReadOnly: false
};

export default class Property extends ModelElement implements Decoratable<PropertyStereotype> {
  type: OntoumlType.PROPERTY_TYPE;
  container: Class | Relation;
  stereotypes: PropertyStereotype[];
  cardinality: string;
  propertyType: Classifier;
  subsettedProperties: Property[]; // TODO: update null when deserializing
  redefinedProperties: Property[];
  aggregationKind: AggregationKind;
  isDerived: boolean;
  isOrdered: boolean;
  isReadOnly: boolean;

  constructor(base?: Partial<Property>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.PROPERTY_TYPE, enumerable: true });

    this.cardinality = this.cardinality || '0..*';
    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
  }

  hasValidStereotype(): boolean {
    return hasValidStereotype(this, Object.values(PropertyStereotype), true);
  }

  getUniqueStereotype(): PropertyStereotype {
    return getUniqueStereotype(this);
  }

  toJSON(): any {
    const propertySerialization: any = {};

    Object.assign(propertySerialization, propertyTemplate, super.toJSON());

    const propertyType = this.propertyType as Class | Relation;
    propertySerialization.propertyType = propertyType.getReference();

    return propertySerialization;
  }

  isAttribute(): boolean {
    throw new Error('Method unimplemented!');
  }

  isRelationEnd(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Only in binary relations
   */
  getOppositeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Only in Nary relations
   */
  getOtherEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getLowerBound(): string {
    throw new Error('Method unimplemented!');
  }

  getUpperBound(): string {
    throw new Error('Method unimplemented!');
  }

  isOptional(): boolean {
    throw new Error('Method unimplemented!');
  }

  isMandatory(): boolean {
    throw new Error('Method unimplemented!');
  }

  toOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  toSome(): boolean {
    throw new Error('Method unimplemented!');
  }

  toMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  isZeroToOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  isZeroToMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  isOneToOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  isOneToMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  hasValidCardinality(): boolean {
    throw new Error('Method unimplemented!');
  }
}
