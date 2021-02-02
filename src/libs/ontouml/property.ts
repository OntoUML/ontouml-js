import {
  Relation,
  Class,
  ModelElement,
  containerUtils,
  Decoratable,
  decoratableUtils,
  stereotypeUtils,
  PropertyStereotype,
  OntoumlType,
  Cardinality,
  AggregationKind
} from './';

export class Property extends ModelElement implements Decoratable<PropertyStereotype> {
  type: OntoumlType.PROPERTY_TYPE;
  container: Class | Relation;
  stereotype: PropertyStereotype;
  cardinality: Cardinality;
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

    this.cardinality = new Cardinality(this.cardinality);
    this.stereotype = this.stereotype || null;
    this.subsettedProperties = this.subsettedProperties || null;
    this.redefinedProperties = this.redefinedProperties || null;
    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
  }

  hasStereotypeContainedIn(stereotypes: PropertyStereotype | PropertyStereotype[]): boolean {
    return decoratableUtils.hasStereotypeContainedIn<PropertyStereotype>(this, stereotypes);
  }

  hasValidStereotypeValue(): boolean {
    return decoratableUtils.hasValidStereotypeValue<PropertyStereotype>(this, stereotypeUtils.PropertyStereotypes, true);
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

    const propertyType = this.propertyType;
    propertySerialization.propertyType = propertyType.getReference();

    return propertySerialization;
  }

  setContainer(newContainer: Class | Relation): void {
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

  clone(): Property {
    return new Property(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Class | Relation;
    }

    if (this.propertyType === (originalElement as Class | Relation)) {
      this.propertyType = newElement as Class | Relation;
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
