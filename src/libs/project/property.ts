import { OntoumlType, AggregationKind, PropertyStereotype } from '@constants/.';
import {
  Relation,
  Class,
  ModelElement,
  setContainer,
  Classifier,
  Decoratable,
  getUniqueStereotype,
  hasValidStereotypeValue,
  stereotypes
} from './';

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

// Babel did not allow me to make this a static field in Property
export const UNBOUNDED_CARDINALITY = Infinity;

export class Property extends ModelElement implements Decoratable<PropertyStereotype> {
  type: OntoumlType.PROPERTY_TYPE;
  container: Class | Relation;
  stereotypes: PropertyStereotype[];
  cardinality: { lowerBound: number; upperBound: number };
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

    this.cardinality = this.cardinality || { lowerBound: 0, upperBound: UNBOUNDED_CARDINALITY };
    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
  }

  hasValidStereotypeValue(): boolean {
    return hasValidStereotypeValue(this, stereotypes.PropertyStereotypes, true);
  }

  getUniqueStereotype(): PropertyStereotype {
    return getUniqueStereotype(this);
  }

  toJSON(): any {
    const propertySerialization: any = {};

    Object.assign(propertySerialization, propertyTemplate, super.toJSON());

    const propertyType = this.propertyType as Class | Relation;
    propertySerialization.propertyType = propertyType.getReference();
    // TODO: transform cardinality

    return propertySerialization;
  }

  setContainer(container: Class | Relation): void {
    setContainer(this, container);
  }

  // TODO: check if we should throw exception when container is not set
  isAttribute(): boolean {
    return this.container instanceof Class;
  }

  // TODO: check if we should throw exception when container is not set
  isRelationEnd(): boolean {
    return this.container instanceof Relation;
  }

  isPropertyTypeDefined(): boolean {
    return this.propertyType instanceof ModelElement;
  }

  isSharedAggregationEnd(): boolean {
    return this.isRelationEnd() && this.aggregationKind === AggregationKind.SHARED;
  }

  isCompositeAggregationEnd(): boolean {
    return this.isRelationEnd() && this.aggregationKind === AggregationKind.COMPOSITE;
  }

  isAggregationEnd(): boolean {
    return this.isSharedAggregationEnd() || this.isCompositeAggregationEnd();
  }

  setCardinality(lowerBound: number, upperBound: number): void {
    if (lowerBound < 0) {
      throw new Error('Lower bound must be a positive number');
    } else if (upperBound < 1) {
      throw new Error('Upper bound must be a positive number greater than zero');
    } else if (lowerBound > upperBound) {
      throw new Error('Lower bound cannot be greater than upper bound');
    } else if (lowerBound === UNBOUNDED_CARDINALITY) {
      throw new Error('Lower bound cannot be unbounded');
    } else if (Number.isNaN(lowerBound) || Number.isNaN(upperBound)) {
      throw new Error('Invalid NaN parameter');
    }

    this.cardinality.lowerBound = lowerBound;
    this.cardinality.upperBound = upperBound;
  }

  setCardinalityToZeroToOne(): void {
    this.setCardinality(0, 1);
  }

  setCardinalityToMany(): void {
    this.setCardinality(0, UNBOUNDED_CARDINALITY);
  }

  setCardinalityToOne(): void {
    this.setCardinality(1, 1);
  }

  setCardinalityToOneToMany(): void {
    this.setCardinality(1, UNBOUNDED_CARDINALITY);
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
