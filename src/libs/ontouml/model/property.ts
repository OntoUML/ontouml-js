import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { Cardinality } from '..';
import { Class } from '..';
import { Classifier } from '..';
import { PropertyStereotype } from '..';
import { Decoratable } from '..';
import { ModelElement } from '..';
import { Relation } from '..';
import { stereotypeUtils } from '..';

export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

export class Property extends Decoratable<PropertyStereotype> {
  cardinality: Cardinality;
  propertyType: Classifier<any, any>;
  subsettedProperties: Property[]; // TODO: update null when deserializing
  redefinedProperties: Property[];
  aggregationKind: AggregationKind;
  isDerived: boolean;
  isOrdered: boolean;
  isReadOnly: boolean;

  constructor(base?: Partial<Property>) {
    super(OntoumlType.PROPERTY_TYPE, base);

    this.cardinality = new Cardinality(this.cardinality);
    this.subsettedProperties = this.subsettedProperties || [];
    this.redefinedProperties = this.redefinedProperties || [];
    this.aggregationKind = this.aggregationKind || AggregationKind.NONE;
    this.isDerived = this.isDerived || false;
    this.isOrdered = this.isOrdered || false;
    this.isReadOnly = this.isReadOnly || false;
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

  isPropertyTypeDefined(): boolean {
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
    if (container instanceof Relation && container.isTernary()) {
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
}
