import {
  Cardinality,
  CardinalityValues,
  Class,
  Classifier,
  ModelElement,
  Property,
  BEGIN,
  END,
  DecoratableBuilder,
  PropertyStereotype
} from '../..';

export class AttributeBuilder extends DecoratableBuilder<
  AttributeBuilder,
  PropertyStereotype
> {
  protected override element?: Property;
  protected override readonly _container: Class;
  private _propertyType?: Classifier<any, any>;
  private _subsettedProperties: Set<Property> = new Set();
  private _redefinedProperties: Set<Property> = new Set();
  private _cardinality: Cardinality = new Cardinality(
    CardinalityValues.ZERO_TO_MANY
  );
  private _isOrdered: boolean = false;
  private _isReadOnly: boolean = false;

  constructor(c: Class) {
    super(c.project!);
    this._container = c;
  }

  /**
   * Builds an instance of {@link Property} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
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

    this._container.addAttribute(this.element);
    return this.element;
  }

  override container(_: ModelElement): AttributeBuilder {
    throw new Error('Container already set on constructor.');
  }

  type(c: Class): AttributeBuilder {
    this._propertyType = c;
    return this;
  }

  ordered(): AttributeBuilder {
    this._isOrdered = true;
    return this;
  }

  unordered(): AttributeBuilder {
    this._isOrdered = false;
    return this;
  }

  readOnly(): AttributeBuilder {
    this._isReadOnly = true;
    return this;
  }

  writable(): AttributeBuilder {
    this._isReadOnly = false;
    return this;
  }

  subsets(p: Property): AttributeBuilder {
    this._subsettedProperties.add(p);
    return this;
  }

  redefines(p: Property): AttributeBuilder {
    this._redefinedProperties.add(p);
    return this;
  }

  cardinality(value: string): AttributeBuilder {
    this._cardinality = new Cardinality(value);
    return this;
  }

  optional(): AttributeBuilder {
    return this.cardinality(CardinalityValues.ZERO_TO_ONE);
  }

  many(): AttributeBuilder {
    return this.cardinality(CardinalityValues.MANY);
  }

  one(): AttributeBuilder {
    return this.cardinality(CardinalityValues.ONE);
  }

  some(): AttributeBuilder {
    return this.cardinality(CardinalityValues.ONE_TO_MANY);
  }

  /**
   * Sets the stereotype field and set default values in case of a known PropertyStereotype.
   */
  override stereotype(stereotype: string): AttributeBuilder {
    switch (stereotype) {
      case BEGIN:
        return this.begin();
      case END:
        return this.end();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype field to `«begin»` as well as the following default values:
   * - `isReadOnly = true`
   * - `cardinality = "1"`
   */
  begin(): AttributeBuilder {
    this._stereotype = BEGIN;
    this.readOnly();
    this.one();
    return this;
  }

  /**
   * Sets the stereotype field to `«end»` as well as the following default values:
   * - `isReadOnly = true`
   * - `cardinality = "1"`
   */
  end(): AttributeBuilder {
    this._stereotype = END;
    this.readOnly();
    this.one();
    return this;
  }
}
