import { ModelElement } from './ModelElement';
import { OntoUMLType, AggregationKind } from '@constants/.';
import { IClassifier } from './Classifier';
import { IDecoratable } from './IDecoratable';

export class Property extends ModelElement implements IDecoratable {
  type: OntoUMLType.PROPERTY_TYPE;
  cardinality: null | string = '0..*';
  propertyType: null | IClassifier;
  subsettedProperties: Property[] = []; // TODO: update null when deserializing
  redefinedProperties: Property[] = [];
  aggregationKind: AggregationKind = AggregationKind.NONE;
  isDerived: boolean = false;
  isOrdered: boolean = false;
  isReadOnly: boolean = false;

  constructor() {
    super();
    throw new Error('Class unimplemented');
  }

  isAttribute(): boolean {
    throw new Error('Method unimplemented!');
  }

  isRelationEnd(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * Only in binary relations
   */
  getOppositeEnd(): Property {
    throw new Error('Method unimplemented!');
  }

  /**
   * Only in Nary relations
   */
  getOtherEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getLowerBound(): string {
    throw new Error('Method unimplemented!');
  }

  getUpperBound(): string {
    throw new Error('Method unimplemented!');
  }

  isOptional(): boolean {
    throw new Error('Method unimplemented!');
  }

  isMandatory(): boolean {
    throw new Error('Method unimplemented!');
  }

  toOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  toSome(): boolean {
    throw new Error('Method unimplemented!');
  }

  toMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  isZeroToOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  isZeroToMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  isOneToOne(): boolean {
    throw new Error('Method unimplemented!');
  }

  isOneToMany(): boolean {
    throw new Error('Method unimplemented!');
  }

  hasValidCardinality(): boolean {
    throw new Error('Method unimplemented!');
  }
}
