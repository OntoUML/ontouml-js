import {
  Cardinality,
  CardinalityValues,
  Class,
  Classifier,
  ModelElement,
  Property,
  DecoratableBuilder,
  PropertyStereotype
} from '../..';

/**
 * A fluent builder for {@link Property} instances.
 *
 * This builder configures a property (an attribute or a relation end) of the
 * {@link Classifier} provided to it on construction, including its type,
 * cardinality, ordering, read-only status, and subsetted and redefined
 * properties. Property builders are typically obtained through
 * `Class.propertyBuilder()`.
 *
 * @example
 * ```typescript
 * const age = person
 *   .propertyBuilder()
 *   .name('age')
 *   .type(numberDatatype)
 *   .cardinality('1')
 *   .build();
 * ```
 */
export class PropertyBuilder extends DecoratableBuilder<
  PropertyBuilder,
  PropertyStereotype
> {
  protected declare element?: Property;
  protected override readonly _container: Classifier<any, any>;
  private _propertyType?: Classifier<any, any>;
  private _subsettedProperties: Set<Property> = new Set();
  private _redefinedProperties: Set<Property> = new Set();
  private _cardinality: Cardinality = new Cardinality(
    CardinalityValues.ZERO_TO_MANY
  );
  private _isOrdered: boolean = false;
  private _isReadOnly: boolean = false;

  /**
   * Creates a builder whose built property will belong to the classifier
   * `c`.
   *
   * @param c - the classifier that will contain the built property.
   */
  constructor(c: Classifier<any, any>) {
    super(c.project!);
    this._container = c;
  }

  /**
   * Builds an instance of {@link Property} with the parameters passed to the
   * builder. **WARNING:** the ordering in which methods are evoked may
   * affect the resulting object. When no methods are evoked, the created
   * property has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isDerived: false,`
   * - `isReadOnly: false,`
   * - `isOrdered: false,`
   * - `cardinality: "0..*"`
   */
  override build(): Property {
    this.element = new Property(this.project);

    super.build();

    this.element.propertyType = this._propertyType;
    this._subsettedProperties.forEach(
      p => this.element?.addSubsettedProperty(p)
    );
    this._redefinedProperties.forEach(
      p => this.element?.addRedefinedProperty(p)
    );
    this.element.cardinality = this._cardinality;
    this.element.isOrdered = this._isOrdered;
    this.element.isReadOnly = this._isReadOnly;

    this._container.addProperty(this.element!);

    return this.element;
  }

  /**
   * Throws an error when evoked. The container of a property is the
   * classifier provided to the constructor and cannot be changed.
   *
   * @throws an error, as the container is already set on the constructor.
   */
  override container(_: ModelElement): PropertyBuilder {
    throw new Error('Container already set on constructor.');
  }

  /**
   * Sets the {@link Class} that types the property, i.e., the class whose
   * instances are the possible values of the property.
   *
   * @returns this builder, for method chaining.
   */
  type(c: Class): PropertyBuilder {
    this._propertyType = c;
    return this;
  }

  /**
   * Sets the property as ordered, i.e., as a property whose values are
   * arranged in a meaningful sequence.
   *
   * @returns this builder, for method chaining.
   */
  ordered(): PropertyBuilder {
    this._isOrdered = true;
    return this;
  }

  /**
   * Sets the property as unordered, reverting a previous call to
   * `ordered()`.
   *
   * @returns this builder, for method chaining.
   */
  unordered(): PropertyBuilder {
    this._isOrdered = false;
    return this;
  }

  /**
   * Sets the property as read-only, i.e., as a property whose values cannot
   * change once assigned.
   *
   * @returns this builder, for method chaining.
   */
  readOnly(): PropertyBuilder {
    this._isReadOnly = true;
    return this;
  }

  /**
   * Sets the property as writable, reverting a previous call to
   * `readOnly()`.
   *
   * @returns this builder, for method chaining.
   */
  writable(): PropertyBuilder {
    this._isReadOnly = false;
    return this;
  }

  /**
   * Adds a {@link Property} subsetted by this property, i.e., a property
   * whose values are a superset of the values of this property.
   *
   * @returns this builder, for method chaining.
   */
  subsets(p: Property): PropertyBuilder {
    this._subsettedProperties.add(p);
    return this;
  }

  /**
   * Adds a {@link Property} redefined by this property, i.e., an inherited
   * property whose definition is overridden by this property.
   *
   * @returns this builder, for method chaining.
   */
  redefines(p: Property): PropertyBuilder {
    this._redefinedProperties.add(p);
    return this;
  }

  /**
   * Sets the cardinality of the property.
   *
   * @param value - the cardinality expression (e.g., `"1"`, `"0..*"`).
   * @returns this builder, for method chaining.
   */
  cardinality(value: string): PropertyBuilder {
    this._cardinality = new Cardinality(value);
    return this;
  }

  /**
   * Sets the cardinality of the property to `0..1`.
   *
   * @returns this builder, for method chaining.
   */
  optional(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ZERO_TO_ONE);
  }

  /**
   * Sets the cardinality of the property to `0..*`.
   *
   * @returns this builder, for method chaining.
   */
  many(): PropertyBuilder {
    return this.cardinality(CardinalityValues.MANY);
  }

  /**
   * Sets the cardinality of the property to `1`.
   *
   * @returns this builder, for method chaining.
   */
  one(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ONE);
  }

  /**
   * Sets the cardinality of the property to `1..*`.
   *
   * @returns this builder, for method chaining.
   */
  some(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ONE_TO_MANY);
  }

  /**
   * Sets the stereotype of the property, delegating to the corresponding
   * shortcut method (`begin()` or `end()`) when the value is a known
   * {@link PropertyStereotype}, in which case the default values of the
   * stereotype are also applied.
   *
   * @param stereotype - the stereotype to decorate the property with.
   * @returns this builder, for method chaining.
   */
  override stereotype(stereotype: string): PropertyBuilder {
    switch (stereotype) {
      case PropertyStereotype.BEGIN:
        return this.begin();
      case PropertyStereotype.END:
        return this.end();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the property to «begin», which decorates
   * properties representing the point in time at which an event begins.
   * Also applies the following defaults:
   * - `isReadOnly = true`
   * - `cardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  begin(): PropertyBuilder {
    this._stereotype = PropertyStereotype.BEGIN;
    this.readOnly();
    this.one();
    return this;
  }

  /**
   * Sets the stereotype of the property to «end», which decorates properties
   * representing the point in time at which an event ends. Also applies the
   * following defaults:
   * - `isReadOnly = true`
   * - `cardinality = "1"`
   *
   * @returns this builder, for method chaining.
   */
  end(): PropertyBuilder {
    this._stereotype = PropertyStereotype.END;
    this.readOnly();
    this.one();
    return this;
  }
}
