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
  Decoratable,
  Project
} from '..';

/**
 * The UML aggregation kinds that a relation end may be decorated with,
 * indicating whether the end marks its type as the whole of a part-whole
 * relation.
 */
export enum AggregationKind {
  /** The property is not a whole end of a part-whole relation. */
  NONE = 'NONE',

  /**
   * The property is the whole end of a part-whole relation in which parts
   * may be shared by multiple wholes (UML's "open diamond").
   */
  SHARED = 'SHARED',

  /**
   * The property is the whole end of a part-whole relation in which parts
   * are exclusive to a single whole (UML's "filled diamond").
   */
  COMPOSITE = 'COMPOSITE'
}

/**
 * A structural feature of a {@link Classifier}, playing one of two roles:
 * an attribute, when contained in a {@link Class} (e.g., the `birthdate` of
 * a `Person`), or a relation end, when contained in a {@link Relation}, in
 * which case it identifies one of the classifiers connected by the relation
 * and holds end-specific constraints such as cardinality and aggregation
 * kind.
 */
export class Property extends Decoratable<PropertyStereotype> {
  /**
   * The classifier that types this property: the attribute's type (e.g., a
   * datatype) or the classifier connected at this relation end.
   */
  propertyType?: Classifier<any, any>;

  private subsettedProperties: Set<Property> = new Set();
  private redefinedProperties: Set<Property> = new Set();

  /** The multiplicity of this property. Defaults to `0..*`. */
  cardinality: Cardinality = new Cardinality('0..*');

  /**
   * The aggregation kind of this property, indicating whether it is the
   * whole end of a part-whole relation.
   */
  aggregationKind: AggregationKind = AggregationKind.NONE;

  /** Indicates whether the values of this property are ordered. */
  isOrdered: boolean = false;

  /**
   * Indicates whether the values of this property are immutable once set.
   * On relation ends, a read-only end signals that the entity at the
   * opposite end existentially depends on the entity at this end.
   */
  isReadOnly: boolean = false;

  constructor(project: Project, propertyType?: Classifier<any, any>) {
    super(project);
    this.propertyType = propertyType;
  }

  /**
   * Asserts that this property is a relation end.
   *
   * @throws an error if the property is not contained in a relation.
   */
  assertRelationEnd(): void {
    if (!this.isRelationEnd()) {
      throw new Error('Property is not owned by a relation.');
    }
  }

  /**
   * Asserts that this property is an end of a binary relation.
   *
   * @throws an error if the property is not contained in a binary relation.
   */
  assertBinaryRelationEnd(): void {
    if (!this.isBinaryRelationEnd()) {
      throw new Error('Property is not owned by a binary relation.');
    }
  }

  /**
   * Asserts that this property is an end of an n-ary relation.
   *
   * @throws an error if the property is not contained in an n-ary relation.
   */
  assertNaryRelationEnd(): void {
    if (!this.isNaryRelationEnd()) {
      throw new Error('Property is not owned by a n-ary relation.');
    }
  }

  /**
   * Retrieves the properties subsetted by this property, i.e., those whose
   * value sets are supersets of this property's.
   */
  getSubsettedProperties(): Property[] {
    return [...this.subsettedProperties];
  }

  /** Adds a property to the set of properties subsetted by this property. */
  addSubsettedProperty(p: Property): void {
    this.subsettedProperties.add(p);
  }

  /**
   * Removes a property from the set of properties subsetted by this
   * property.
   *
   * @returns `true` if the property was present and removed.
   */
  removeSubsettedProperty(p: Property): boolean {
    return this.subsettedProperties.delete(p);
  }

  /**
   * Retrieves the properties redefined by this property, i.e., inherited
   * properties whose definition this property overrides.
   */
  getRedefinedProperties(): Property[] {
    return [...this.redefinedProperties];
  }

  /** Adds a property to the set of properties redefined by this property. */
  addRedefinedProperty(p: Property): void {
    this.redefinedProperties.add(p);
  }

  /**
   * Removes a property from the set of properties redefined by this
   * property.
   *
   * @returns `true` if the property was present and removed.
   */
  removeRedefinedProperty(p: Property): boolean {
    return this.redefinedProperties.delete(p);
  }

  /**
   * Lists the stereotypes that OntoUML allows on properties, i.e., all
   * values of {@link PropertyStereotype}.
   */
  getAllowedStereotypes(): PropertyStereotype[] {
    return Object.values(PropertyStereotype);
  }

  /** Checks whether this property is an attribute of a {@link Class}. */
  isAttribute(): boolean {
    return this.container instanceof Class;
  }

  /** Checks whether this property is an end of a {@link Relation}. */
  isRelationEnd(): boolean {
    return this.container instanceof Relation;
  }

  /** Checks whether this property is an end of a {@link BinaryRelation}. */
  isBinaryRelationEnd(): boolean {
    return this.container instanceof BinaryRelation;
  }

  /** Checks whether this property is an end of a {@link NaryRelation}. */
  isNaryRelationEnd(): boolean {
    return this.container instanceof NaryRelation;
  }

  /**
   * Checks whether this property is the source end of a binary relation.
   */
  isSource(): boolean {
    if (!this.isBinaryRelationEnd()) {
      return false;
    }

    return (this.container as BinaryRelation).sourceEnd === this;
  }

  /**
   * Checks whether this property is the target end of a binary relation.
   */
  isTarget(): boolean {
    if (!this.isBinaryRelationEnd()) {
      return false;
    }

    return (this.container as BinaryRelation).targetEnd === this;
  }

  /** Checks whether this property has a type. */
  hasPropertyType(): boolean {
    return this.propertyType instanceof Classifier;
  }

  /**
   * Checks whether this property is a relation end decorated with shared
   * aggregation.
   */
  isShared(): boolean {
    return (
      this.isRelationEnd() && this.aggregationKind === AggregationKind.SHARED
    );
  }

  /**
   * Checks whether this property is a relation end decorated with composite
   * aggregation.
   */
  isComposite(): boolean {
    return (
      this.isRelationEnd() && this.aggregationKind === AggregationKind.COMPOSITE
    );
  }

  /**
   * Checks whether this property is the whole end of a part-whole relation,
   * i.e., whether it is decorated with shared or composite aggregation.
   */
  isWholeEnd(): boolean {
    return this.isShared() || this.isComposite();
  }

  /**
   * Checks whether this property is the part end of a part-whole relation,
   * i.e., whether the opposite end is a whole end while this end has no
   * aggregation.
   *
   * @throws an error if the property is not an end of a binary relation.
   */
  isPartEnd(): boolean {
    return (
      this.getOppositeEnd().isWholeEnd() &&
      this.aggregationKind === AggregationKind.NONE
    );
  }

  /**
   * Retrieves the relation that contains this property.
   *
   * @throws an error if the property is not a relation end.
   */
  getRelation(): Relation {
    this.assertRelationEnd();
    return this.container as Relation;
  }

  /**
   * Retrieves the binary relation that contains this property.
   *
   * @throws an error if the property is not an end of a binary relation.
   */
  getBinaryRelation(): BinaryRelation {
    this.assertBinaryRelationEnd();
    return this.container as BinaryRelation;
  }

  /**
   * Retrieves the n-ary relation that contains this property.
   *
   * @throws an error if the property is not an end of an n-ary relation.
   */
  getNaryRelation(): NaryRelation {
    this.assertNaryRelationEnd();
    return this.container as NaryRelation;
  }

  /**
   * Retrieves the property at the opposite end of the binary relation that
   * contains this property.
   *
   * @throws an error if the property is not an end of a binary relation.
   */
  getOppositeEnd(): Property {
    const container = this.getBinaryRelation();
    return this !== container.sourceEnd
      ? container.sourceEnd
      : container.targetEnd;
  }

  /**
   * Retrieves the other ends of the relation that contains this property.
   *
   * @throws an error if the property is not a relation end.
   */
  getOtherEnds(): Property[] {
    const container = this.getRelation();
    return container.properties.filter(p => p !== this);
  }

  override toJSON(): any {
    return {
      type: OntoumlType.PROPERTY,
      ...super.toJSON(),
      cardinality: this.cardinality.toJSON(),
      propertyType: this.propertyType?.id ?? null,
      subsettedProperties: [...this.subsettedProperties].map(p => p.id),
      redefinedProperties: [...this.redefinedProperties].map(p => p.id),
      aggregationKind: this.aggregationKind ?? null,
      isOrdered: this.isOrdered ?? null,
      isReadOnly: this.isReadOnly ?? null
    };
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
}
