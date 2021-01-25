import {
  Relation,
  Class,
  ModelElement,
  containerUtils,
  Classifier,
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
  cardinality: Cardinality;
  propertyType: Classifier<any>;
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

    if (typeof this.cardinality === 'string') {
      this.cardinality = Property.parseCardinality(this.cardinality as string);
    } else if (!this.cardinality) {
      this.cardinality = { lowerBound: 0, upperBound: UNBOUNDED_CARDINALITY };
    }

    this.stereotype = this.stereotype || null;
    this.subsettedProperties = this.subsettedProperties || null;
    this.redefinedProperties = this.redefinedProperties || null;

    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
  }

  static parseCardinality(cardinalityString: string): Cardinality {
    const cardinalities = cardinalityString.split('..');
    const lowerBoundString: any = cardinalities[0];
    const upperBoundString: any = cardinalities[1] || cardinalities[0];
    const lowerBound = lowerBoundString === '*' ? 0 : Number(lowerBoundString);
    const upperBound = upperBoundString === '*' ? UNBOUNDED_CARDINALITY : Number(upperBoundString);

    if (isNaN(lowerBound) || isNaN(upperBound)) {
      return { lowerBound: 0, upperBound: UNBOUNDED_CARDINALITY };
    } else {
      return { lowerBound, upperBound };
    }
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

    if (this.cardinality) {
      let lowerBound = this.cardinality.lowerBound;
      let upperBound = this.cardinality.upperBound;

      propertySerialization.cardinality = `${lowerBound}..${upperBound === UNBOUNDED_CARDINALITY ? '*' : upperBound}`;
    }

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
    return this.cardinality.lowerBound === 0;
  }

  isMandatory(): boolean {
    return !this.isOptional();
  }

  isZeroToOne(): boolean {
    const card = this.cardinality;
    return card.lowerBound === 0 && card.upperBound === 1;
  }

  isZeroToMany(): boolean {
    const card = this.cardinality;
    return card.lowerBound === 0 && card.upperBound === UNBOUNDED_CARDINALITY;
  }

  isOneToOne(): boolean {
    const card = this.cardinality;
    return card.lowerBound === 1 && card.upperBound === 1;
  }

  isOneToMany(): boolean {
    const card = this.cardinality;
    return card.lowerBound === 1 && card.upperBound === UNBOUNDED_CARDINALITY;
  }

  hasValidCardinality(): boolean {
    return Property.isCardinalityValid(this.cardinality);
  }

  isBounded(): boolean {
    return this.cardinality && this.cardinality.upperBound < propertyUtils.UNBOUNDED_CARDINALITY;
  }

  static isCardinalityValid(cardinality: Cardinality): boolean {
    const { lowerBound, upperBound } = cardinality;
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
