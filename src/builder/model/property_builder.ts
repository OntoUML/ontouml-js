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

export class PropertyBuilder extends DecoratableBuilder<
  PropertyBuilder,
  PropertyStereotype
> {
  protected override element?: Property;
  protected override readonly _container: Classifier<any, any>;
  private _propertyType?: Classifier<any, any>;
  private _subsettedProperties: Set<Property> = new Set();
  private _redefinedProperties: Set<Property> = new Set();
  private _cardinality: Cardinality = new Cardinality(
    CardinalityValues.ZERO_TO_MANY
  );
  private _isOrdered: boolean = false;
  private _isReadOnly: boolean = false;

  constructor(c: Classifier<any, any>) {
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

    this._container.addProperty(this.element!);

    return this.element;
  }

  override container(_: ModelElement): PropertyBuilder {
    throw new Error('Container already set on constructor.');
  }

  type(c: Class): PropertyBuilder {
    this._propertyType = c;
    return this;
  }

  ordered(): PropertyBuilder {
    this._isOrdered = true;
    return this;
  }

  unordered(): PropertyBuilder {
    this._isOrdered = false;
    return this;
  }

  readOnly(): PropertyBuilder {
    this._isReadOnly = true;
    return this;
  }

  writable(): PropertyBuilder {
    this._isReadOnly = false;
    return this;
  }

  subsets(p: Property): PropertyBuilder {
    this._subsettedProperties.add(p);
    return this;
  }

  redefines(p: Property): PropertyBuilder {
    this._redefinedProperties.add(p);
    return this;
  }

  cardinality(value: string): PropertyBuilder {
    this._cardinality = new Cardinality(value);
    return this;
  }

  optional(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ZERO_TO_ONE);
  }

  many(): PropertyBuilder {
    return this.cardinality(CardinalityValues.MANY);
  }

  one(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ONE);
  }

  some(): PropertyBuilder {
    return this.cardinality(CardinalityValues.ONE_TO_MANY);
  }

  /**
   * Sets the stereotype field and set default values in case of a known PropertyStereotype.
   */
  override stereotype(stereotype: string): PropertyBuilder {
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
  begin(): PropertyBuilder {
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
  end(): PropertyBuilder {
    this._stereotype = END;
    this.readOnly();
    this.one();
    return this;
  }
}
