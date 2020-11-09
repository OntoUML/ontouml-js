import { ClassStereotype, PropertyStereotype, RelationStereotype } from '@constants/.';
import { Class, Relation, Property } from '@libs/project/';

describe('Decoratable Interface Tests', () => {
  it('Class with no stereotypes', () => {
    const _class = new Class();
    expect(_class.getUniqueStereotype()).toBeUndefined();
    expect(_class.hasValidStereotypeValue()).not.toBeTruthy();
  });

  it('Class with single stereotype', () => {
    // Invalid stereotype
    const _class = new Class({ stereotypes: ['asd' as ClassStereotype] });
    expect(_class.getUniqueStereotype()).toEqual('asd');
    expect(_class.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    _class.stereotypes = [ClassStereotype.KIND];
    expect(_class.getUniqueStereotype()).toEqual(ClassStereotype.KIND);
    expect(_class.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Class with multiple stereotypes', () => {
    const _class = new Class({ stereotypes: [ClassStereotype.KIND, ClassStereotype.ABSTRACT] });
    expect(() => _class.getUniqueStereotype()).toThrow();
    expect(_class.hasValidStereotypeValue()).not.toBeTruthy();
  });

  it('Relation with no stereotypes', () => {
    const relation = new Relation();
    expect(relation.getUniqueStereotype()).toBeUndefined();
    expect(relation.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Relation with single stereotype', () => {
    // Invalid stereotype
    const relation = new Relation({ stereotypes: ['asd' as RelationStereotype] });
    expect(relation.getUniqueStereotype()).toEqual('asd');
    expect(relation.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    relation.stereotypes = [RelationStereotype.MATERIAL];
    expect(relation.getUniqueStereotype()).toEqual(RelationStereotype.MATERIAL);
    expect(relation.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Relation with multiple stereotypes', () => {
    const relation = new Relation({ stereotypes: [RelationStereotype.MATERIAL, RelationStereotype.MEDIATION] });
    expect(() => relation.getUniqueStereotype()).toThrow();
    expect(relation.hasValidStereotypeValue()).not.toBeTruthy();
  });

  it('Property with no stereotypes', () => {
    const property = new Property();
    expect(property.getUniqueStereotype()).toBeUndefined();
    expect(property.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Property with single stereotype', () => {
    // Invalid stereotype
    const property = new Property({ stereotypes: ['asd' as PropertyStereotype] });
    expect(property.getUniqueStereotype()).toEqual('asd');
    expect(property.hasValidStereotypeValue()).not.toBeTruthy();

    // Valid stereotype
    property.stereotypes = [PropertyStereotype.BEGIN];
    expect(property.getUniqueStereotype()).toEqual(PropertyStereotype.BEGIN);
    expect(property.hasValidStereotypeValue()).toBeTruthy();
  });

  it('Property with multiple stereotypes', () => {
    const property = new Property({ stereotypes: [PropertyStereotype.BEGIN, PropertyStereotype.END] });
    expect(() => property.getUniqueStereotype()).toThrow();
    expect(property.hasValidStereotypeValue()).not.toBeTruthy();
  });
});
