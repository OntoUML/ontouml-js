import {
  OntoumlElement,
  OntoumlType,
  Cardinality,
  Class,
  Classifier,
  PropertyStereotype,
  Decoratable,
  ModelElement,
  Relation,
  stereotypeUtils
} from '..';

export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

export class Property extends Decoratable<PropertyStereotype> {
  propertyType?: Classifier<any, any>;
  subsettedProperties: Property[]; // TODO: update null when deserializing
  redefinedProperties: Property[];
  cardinality?: Cardinality;
  aggregationKind?: AggregationKind;
  isOrdered: boolean;
  isReadOnly: boolean;

  constructor(container: Classifier<any,any>, propertyType?: Classifier<any,any>) {
    super(container.project!, container);

    this.propertyType = this.propertyType;
    this.cardinality = new Cardinality("0..*");
    this.subsettedProperties = [];
    this.redefinedProperties = [];
    this.aggregationKind = AggregationKind.NONE;
    this.isOrdered = false;
    this.isReadOnly = false;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  getAllowedStereotypes(): PropertyStereotype[] {
    return stereotypeUtils.PropertyStereotypes;
  }

  isAttribute(): boolean {
    return this.container instanceof Class;
  }

  isRelationEnd(): boolean {
    return this.container instanceof Relation;
  }

  isSource(): boolean {
    if (!this.isRelationEnd()) return false;
    return (this.container as Relation).getSourceEnd() === this;
  }

  isTarget(): boolean {
    if (!this.isRelationEnd()) return false;
    return (this.container as Relation).getTargetEnd() === this;
  }

  hasPropertyType(): boolean {
    return this.propertyType instanceof Classifier;
  }

  isShared(): boolean {
    return this.isRelationEnd() && this.aggregationKind === AggregationKind.SHARED;
  }

  isComposite(): boolean {
    return this.isRelationEnd() && this.aggregationKind === AggregationKind.COMPOSITE;
  }

  isAggregationEnd(): boolean {
    return this.isShared() || this.isComposite();
  }

  /**
   * Only in binary relations
   */
  getOppositeEnd(): Property {
    if (this.container instanceof Relation && this.container.isBinary()) {
      return this !== this.container.getSourceEnd() ? this.container.getSourceEnd() : this.container.getTargetEnd();
    }

    throw new Error('Invalid method on non-binary relations');
  }

  /**
   * Only in Nary relations
   */
  getOtherEnds(): Property[] {
    const container = this.container;
    if (container instanceof Relation && container.isNary()) {
      return container.properties.filter((relationEnd: Property) => relationEnd !== this);
    } else {
      throw new Error('Invalid method on non-ternary relations');
    }
  }

  clone(): Property {
    return {...this}
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement;
    }

    if (this.propertyType === originalElement) {
      this.propertyType = newElement as Classifier<any, any>;
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

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.PROPERTY,
      cardinality: null,
      propertyType: this.propertyType?.id,
      subsettedProperties: this.subsettedProperties.map(p => p.id),
      redefinedProperties: this.redefinedProperties.map(p => p.id),
      aggregationKind: this.aggregationKind,
      isOrdered: this.isOrdered,
      isReadOnly: this.isReadOnly
    };

    return {...object, ...super.toJSON()};
  }

  override resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    super.resolveReferences(elementReferenceMap);

    const { propertyType } = this;

    if (propertyType) {
      this.propertyType = OntoumlElement.resolveReference(propertyType, elementReferenceMap, this, 'propertyType');
    }
  }
}
