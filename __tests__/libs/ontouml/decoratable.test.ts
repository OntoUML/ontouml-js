import { Class, Relation, Property, ClassStereotype, PropertyStereotype, RelationStereotype } from '@libs/ontouml';

describe('Decoratable Interface Tests', () => {
  it('Class with no stereotypes', () => {
    const _class = new Class();
    expect(_class.stereotype).toBeNull();
    expect(_class.hasValidStereotypeValue()).not.toBeTruthy();
  });

  it('Class with single stereotype', () => {
    // Invalid stereotype
    const _class = new Class({ stereotype: 'asd' as ClassStereotype });
    expect(_class.stereotype).toEqual('asd');
    expect(_class.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    _class.stereotype = ClassStereotype.KIND;
    expect(_class.stereotype).toEqual(ClassStereotype.KIND);
    expect(_class.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Relation with no stereotypes', () => {
    const relation = new Relation();
    expect(relation.stereotype).toBeNull();
    expect(relation.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Relation with single stereotype', () => {
    // Invalid stereotype
    const relation = new Relation({ stereotype: 'asd' as RelationStereotype });
    expect(relation.stereotype).toEqual('asd');
    expect(relation.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    relation.stereotype = RelationStereotype.MATERIAL;
    expect(relation.stereotype).toEqual(RelationStereotype.MATERIAL);
    expect(relation.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Property with no stereotypes', () => {
    const property = new Property();
    expect(property.stereotype).toBeNull();
    expect(property.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Property with single stereotype', () => {
    // Invalid stereotype
    const property = new Property({ stereotype: 'asd' as PropertyStereotype });
    expect(property.stereotype).toEqual('asd');
    expect(property.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    property.stereotype = PropertyStereotype.BEGIN;
    expect(property.stereotype).toEqual(PropertyStereotype.BEGIN);
    expect(property.hasValidStereotypeValue()).toBeTruthy();
  });
});
