import {
  Relation,
  Class,
  ModelElement,
  containerUtils,
  Decoratable,
  decoratableUtils,
  stereotypesUtils,
  PropertyStereotype,
  OntoumlType,
  ClassifierType
} from './';

export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

// Babel did not allow me to make this a static field in Property
const UNBOUNDED_CARDINALITY = Infinity;

export const propertyUtils = {
  UNBOUNDED_CARDINALITY
};

export type Cardinality = { lowerBound: number; upperBound: number };

export class Property extends ModelElement implements Decoratable<PropertyStereotype> {
  type: OntoumlType.PROPERTY_TYPE;
  container: ClassifierType;
  stereotype: PropertyStereotype;
  cardinality: string;
  propertyType: Relation | Class;
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

    this.stereotype = this.stereotype || null;
    this.subsettedProperties = this.subsettedProperties || null;
    this.redefinedProperties = this.redefinedProperties || null;

    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
  }

  static parseCardinality(cardinalityString: string): Cardinality {
    let lowerBoundString = '';
    let upperBoundString = '';

    if (cardinalityString.includes('..')) {
      const cardinalities = cardinalityString.split('..');
      lowerBoundString = cardinalities[0];
      upperBoundString = cardinalities[1] || cardinalities[0];
    } else {
      lowerBoundString = upperBoundString = cardinalityString;
    }

    const lowerBound = lowerBoundString === '*' ? UNBOUNDED_CARDINALITY : Number(lowerBoundString);
    const upperBound = upperBoundString === '*' ? UNBOUNDED_CARDINALITY : Number(upperBoundString);

    return { lowerBound, upperBound };
  }

  hasStereotypeContainedIn(stereotypes: PropertyStereotype | PropertyStereotype[]): boolean {
    return decoratableUtils.hasStereotypeContainedIn<PropertyStereotype>(this, stereotypes);
  }

  hasValidStereotypeValue(): boolean {
    return decoratableUtils.hasValidStereotypeValue<PropertyStereotype>(this, stereotypesUtils.PropertyStereotypes, true);
  }

  toJSON(): any {
    const propertySerialization = {
      stereotype: null,
      cardinality: null,
      propertyType: null,
      subsettedProperties: null,
      redefinedProperties: null,
      aggregationKind: null,
      isDerived: false,
      isOrdered: false,
      isReadOnly: false
    };

    Object.assign(propertySerialization, super.toJSON());

    const propertyType = this.propertyType as ClassifierType;
    propertySerialization.propertyType = propertyType.getReference();

    return propertySerialization;
  }

  setContainer(newContainer: ClassifierType): void {
    containerUtils.setContainer(this, newContainer, 'properties', true);
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

  setCardinalityFromNumbers(lowerBound: number, upperBound: number): void {
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

    this.cardinality = lowerBound + '..' + (upperBound === UNBOUNDED_CARDINALITY ? '*' : upperBound);
  }

  setCardinalityToZeroToOne(): void {
    this.setCardinalityFromNumbers(0, 1);
  }

  setCardinalityToMany(): void {
    this.setCardinalityFromNumbers(0, UNBOUNDED_CARDINALITY);
  }

  setCardinalityToOne(): void {
    this.setCardinalityFromNumbers(1, 1);
  }

  setCardinalityToOneToMany(): void {
    this.setCardinalityFromNumbers(1, UNBOUNDED_CARDINALITY);
  }

  getLowerBoundAsNumber(): number {
    return Property.parseCardinality(this.cardinality).lowerBound;
  }

  getUpperBoundAsNumber(): number {
    return Property.parseCardinality(this.cardinality).upperBound;
  }

  /**
   * Only in binary relations
   */
  getOppositeEnd(): Property {
    const container = this.container;
    if (container instanceof Relation && container.isBinaryRelation()) {
      return this !== container.getSourceEnd() ? container.getSourceEnd() : container.getTargetEnd();
    } else {
      throw new Error('Invalid method on non-binary relations');
    }
  }

  /**
   * Only in Nary relations
   */
  getOtherEnds(): Property[] {
    const container = this.container;
    if (container instanceof Relation && container.isTernaryRelation()) {
      return container.properties.filter((relationEnd: Property) => relationEnd !== this);
    } else {
      throw new Error('Invalid method on non-ternary relations');
    }
  }

  isOptional(): boolean {
    return this.getLowerBoundAsNumber() === 0;
  }

  isMandatory(): boolean {
    return !this.isOptional();
  }

  isZeroToOne(): boolean {
    return this.getLowerBoundAsNumber() === 0 && this.getUpperBoundAsNumber() === 1;
  }

  isZeroToMany(): boolean {
    return this.getLowerBoundAsNumber() === 0 && this.getUpperBoundAsNumber() === UNBOUNDED_CARDINALITY;
  }

  isOneToOne(): boolean {
    return this.getLowerBoundAsNumber() === 1 && this.getUpperBoundAsNumber() === 1;
  }

  isOneToMany(): boolean {
    return this.getLowerBoundAsNumber() === 1 && this.getUpperBoundAsNumber() === UNBOUNDED_CARDINALITY;
  }

  hasValidCardinality(): boolean {
    return Property.isCardinalityValid(this.cardinality);
  }

  isBounded(): boolean {
    return this.cardinality !== '*' && this.cardinality !== '0..*';
  }

  static isCardinalityValid(cardinality: string): boolean {
    const { lowerBound, upperBound } = Property.parseCardinality(cardinality);
    return !(
      lowerBound < 0 ||
      upperBound < 0 ||
      lowerBound > upperBound ||
      lowerBound === UNBOUNDED_CARDINALITY ||
      isNaN(lowerBound) ||
      isNaN(upperBound)
    );
  }

  clone(): Property {
    return new Property(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as ClassifierType;
    }

    if (this.propertyType === (originalElement as ClassifierType)) {
      this.propertyType = newElement as ClassifierType;
    }

    if (this.subsettedProperties && this.subsettedProperties.includes(originalElement as any)) {
      this.subsettedProperties = this.subsettedProperties.map((subsettedProperty: Property) =>
        subsettedProperty === originalElement ? (newElement as Property) : subsettedProperty
      );
    }

    if (this.redefinedProperties && this.redefinedProperties.includes(originalElement as any)) {
      this.redefinedProperties = this.redefinedProperties.map((redefinedProperty: Property) =>
        redefinedProperty === originalElement ? (newElement as Property) : redefinedProperty
      );
    }
  }
}
