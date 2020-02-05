import { Decoratable, Classifier } from '.';
import { Enumaration } from './literals';
import { PROPERTY_TYPE } from '@constants/';

/**
 * Class that represents an OntoUML property. These properties are analogous to both UML attributes and association ends, depending or their containers for proper comparisson.
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Property extends Decoratable {
  container: Classifier;
  cardinality: string | null;
  propertyType: Classifier | Enumaration | null;
  subsettedProperties: Property[] | null;
  redefinedProperties: Property[] | null;
  aggregationKind: 'NONE' | 'SHARED' | 'COMPOSITE';
  isDerived: boolean | null;
  isOrdered: boolean | null;
  isReadOnly: boolean | null;

  constructor(
    id: string,
    enableHash = false,
    name?: string,
    description?: string,
    stereotypes?: string[],
    cardinality?: string,
    propertyType?: Classifier | Enumaration,
    subsettedProperties?: Property[],
    redefinedProperties?: Property[],
    aggregationKind?: 'NONE' | 'SHARED' | 'COMPOSITE',
    isDerived?: boolean,
    isOrdered?: boolean,
    isReadOnly?: boolean,
    container?: Classifier,
  ) {
    super(
      PROPERTY_TYPE,
      id,
      enableHash,
      name,
      description,
      stereotypes,
      container,
    );
    this.cardinality = cardinality;
    this.propertyType = propertyType;
    this.subsettedProperties = subsettedProperties;
    this.redefinedProperties = redefinedProperties;
    this.aggregationKind = aggregationKind;
    this.isDerived = isDerived;
    this.isOrdered = isOrdered;
    this.isReadOnly = isReadOnly;

    // if (enableHash) {}
  }
}
