import {describe, expect, it, beforeEach, beforeAll} from '@jest/globals';
import { Class, Relation, Property, ClassStereotype, PropertyStereotype, RelationStereotype } from '../src';

describe('Decoratable Interface Tests', () => {
  it('Class with no stereotypes', () => {
    const _class = new Class();
    expect(_class.stereotype).toBeNull();
    expect(_class.hasValidStereotype()).not.toBeTruthy();
  });

  it('Class with single stereotype', () => {
    // Invalid stereotype
    const _class = new Class({ stereotype: 'asd' as ClassStereotype });
    expect(_class.stereotype).toEqual('asd');
    expect(_class.hasValidStereotype()).not.toBeTruthy();

    // Valid stereotype
    _class.stereotype = ClassStereotype.KIND;
    expect(_class.stereotype).toEqual(ClassStereotype.KIND);
    expect(_class.hasValidStereotype()).toBeTruthy();
  });

  it('Relation with no stereotypes', () => {
    const relation = new Relation();
    expect(relation.stereotype).toBeNull();
    expect(relation.hasValidStereotype()).toBeTruthy();
  });

  it('Relation with single stereotype', () => {
    // Invalid stereotype
    const relation = new Relation({ stereotype: 'asd' as RelationStereotype });
    expect(relation.stereotype).toEqual('asd');
    expect(relation.hasValidStereotype()).not.toBeTruthy();

    // Valid stereotype
    relation.stereotype = RelationStereotype.MATERIAL;
    expect(relation.stereotype).toEqual(RelationStereotype.MATERIAL);
    expect(relation.hasValidStereotype()).toBeTruthy();
  });

  it('Property with no stereotypes', () => {
    const property = new Property();
    expect(property.stereotype).toBeNull();
    expect(property.hasValidStereotype()).toBeTruthy();
  });

  it('Property with single stereotype', () => {
    // Invalid stereotype
    const property = new Property({ stereotype: 'asd' as PropertyStereotype });
    expect(property.stereotype).toEqual('asd');
    expect(property.hasValidStereotype()).not.toBeTruthy();

    // Valid stereotype
    property.stereotype = PropertyStereotype.BEGIN;
    expect(property.stereotype).toEqual(PropertyStereotype.BEGIN);
    expect(property.hasValidStereotype()).toBeTruthy();
  });
});
