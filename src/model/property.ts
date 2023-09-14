import {
  OntoumlElement,
  OntoumlType,
  Cardinality,
  Class,
  Classifier,
  PropertyStereotype,
  ModelElement,
  Relation,
  BinaryRelation,
  NaryRelation,
  Decoratable
} from '..';

export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

export class Property extends Decoratable<PropertyStereotype> {
  propertyType?: Classifier<any, any>;
  private subsettedProperties: Set<Property> = new Set();
  private redefinedProperties: Set<Property> = new Set();
  cardinality: Cardinality = new Cardinality('0..*');
  aggregationKind: AggregationKind = AggregationKind.NONE;
  isOrdered: boolean = false;
  isReadOnly: boolean = false;

  constructor(
    classifier: Classifier<any, any>,
    propertyType?: Classifier<any, any>
  ) {
    super(classifier.project!);
    this.propertyType = propertyType;
  }

  assertRelationEnd(): void {
    if (!this.isRelationEnd()) {
      throw new Error('Property is not owned by a relation.');
    }
  }

  assertBinaryRelationEnd(): void {
    if (!this.isBinaryRelationEnd()) {
      throw new Error('Property is not owned by a binary relation.');
    }
  }

  assertNaryRelationEnd(): void {
    if (!this.isNaryRelationEnd()) {
      throw new Error('Property is not owned by a n-ary relation.');
    }
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  getAllowedStereotypes(): PropertyStereotype[] {
    return Object.values(PropertyStereotype);
  }

  isAttribute(): boolean {
    return this.container instanceof Class;
  }

  isRelationEnd(): boolean {
    return this.container instanceof Relation;
  }

  isBinaryRelationEnd(): boolean {
    return this.container instanceof BinaryRelation;
  }

  isNaryRelationEnd(): boolean {
    return this.container instanceof NaryRelation;
  }

  isSource(): boolean {
    if (!this.isBinaryRelationEnd()) {
      return false;
    }

    return (this.container as BinaryRelation).getSourceEnd() === this;
  }

  isTarget(): boolean {
    if (!this.isBinaryRelationEnd()) {
      return false;
    }

    return (this.container as BinaryRelation).getTargetEnd() === this;
  }

  hasPropertyType(): boolean {
    return this.propertyType instanceof Classifier;
  }

  isShared(): boolean {
    return (
      this.isRelationEnd() && this.aggregationKind === AggregationKind.SHARED
    );
  }

  isComposite(): boolean {
    return (
      this.isRelationEnd() && this.aggregationKind === AggregationKind.COMPOSITE
    );
  }

  isAggregationEnd(): boolean {
    return this.isShared() || this.isComposite();
  }

  getRelation(): Relation {
    this.assertRelationEnd();
    return this.container as Relation;
  }

  getBinaryRelation(): BinaryRelation {
    this.assertBinaryRelationEnd();
    return this.container as BinaryRelation;
  }

  getNaryRelation(): NaryRelation {
    this.assertNaryRelationEnd();
    return this.container as NaryRelation;
  }

  /**
   * @returns the property on the opposite end of the relation containing the property.
   * @throws an error if invoked on a property that is not contained by a binary relation.
   */
  getOppositeEnd(): Property {
    const container = this.getBinaryRelation();
    return this !== container.getSourceEnd()
      ? container.getSourceEnd()
      : container.getTargetEnd();
  }

  /**
   * @returns an array with the other properties contained by the relation containing the property.
   * @throws an error if invoked on a property that is not contained by a relation.
   */
  getOtherEnds(): Property[] {
    const container = this.getRelation();
    return container.properties.filter(p => p !== this);
  }

  clone(): Property {
    return { ...this };
  }

  // TODO: reconsider the usefulness of this method
  replace(originalElement: ModelElement, newElement: ModelElement): void {
    throw new Error('Method unimplemented!');
    // if (this.container === originalElement) {
    //   this.container = newElement;
    // }

    // if (this.propertyType === originalElement) {
    //   this.propertyType = newElement as Classifier<any, any>;
    // }

    // if (
    //   this.subsettedProperties &&
    //   this.subsettedProperties.includes(originalElement as any)
    // ) {
    //   this.subsettedProperties = this.subsettedProperties.map(
    //     (subsettedProperty: Property) =>
    //       subsettedProperty === originalElement
    //         ? (newElement as Property)
    //         : subsettedProperty
    //   );
    // }

    // if (
    //   this.redefinedProperties &&
    //   this.redefinedProperties.includes(originalElement as any)
    // ) {
    //   this.redefinedProperties = this.redefinedProperties.map(
    //     (redefinedProperty: Property) =>
    //       redefinedProperty === originalElement
    //         ? (newElement as Property)
    //         : redefinedProperty
    //   );
    // }
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.PROPERTY,
      cardinality: this.cardinality.toJSON(),
      propertyType: this.propertyType?.id ?? null,
      subsettedProperties: [...this.subsettedProperties].map(p => p.id),
      redefinedProperties: [...this.redefinedProperties].map(p => p.id),
      aggregationKind: this.aggregationKind ?? null,
      isOrdered: this.isOrdered ?? null,
      isReadOnly: this.isReadOnly ?? null
    };

    return { ...super.toJSON(), ...object };
  }

  override resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void {
    super.resolveReferences(elementReferenceMap);

    const { propertyType } = this;

    if (propertyType) {
      this.propertyType = OntoumlElement.resolveReference(
        propertyType,
        elementReferenceMap,
        this,
        'propertyType'
      );
    }
  }

  getSubsettedProperties(): Property[] {
    return [...this.subsettedProperties];
  }

  addSubsettedProperty(p: Property): void {
    this.subsettedProperties.add(p);
  }

  removeSubsettedProperty(p: Property): boolean {
    return this.subsettedProperties.delete(p);
  }

  getRedefinedProperties(): Property[] {
    return [...this.redefinedProperties];
  }

  addRedefinedProperty(p: Property): void {
    this.redefinedProperties.add(p);
  }

  removeRedefinedProperty(p: Property): boolean {
    return this.redefinedProperties.delete(p);
  }
}
