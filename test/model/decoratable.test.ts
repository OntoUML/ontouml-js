import { Class, Property, Project, BinaryRelation } from '../../src';

describe('hasValidStereotype()', () => {
  let proj: Project;
  let c: Class;
  let r: BinaryRelation;
  let p: Property;

  beforeEach(() => {
    proj = new Project();
  });

  it('should return false for a class without a stereotype', () => {
    c = proj.classBuilder().build();
    expect(c.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a class without a stereotype if `allowsTrue = true`', () => {
    c = proj.classBuilder().build();
    expect(c.hasValidStereotype(true)).toBeTrue();
  });

  it('should return false for a class with a custom stereotype', () => {
    c = proj.classBuilder().stereotype('asd').build();
    expect(c.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a class stereotyped as «kind»', () => {
    c = proj.classBuilder().kind().build();
    expect(c.hasValidStereotype()).toBeTrue();
  });

  it('should return false for a relation without a stereotype', () => {
    c = proj.classBuilder().build();
    r = proj.binaryRelationBuilder().source(c).target(c).build();
    expect(r.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a relation without a stereotype if `allowsTrue = true`', () => {
    c = proj.classBuilder().build();
    r = proj.binaryRelationBuilder().source(c).target(c).build();
    expect(r.hasValidStereotype(true)).toBeTrue();
  });

  it('should return false for a relation with a custom stereotype', () => {
    c = proj.classBuilder().build();
    r = proj
      .binaryRelationBuilder()
      .source(c)
      .target(c)
      .stereotype('my-stereotype')
      .build();

    expect(r.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a relation stereotyped as «material»', () => {
    c = proj.classBuilder().build();
    r = proj.binaryRelationBuilder().source(c).target(c).material().build();

    expect(r.hasValidStereotype()).toBeTrue();
  });

  it('should return false for a property without a stereotype', () => {
    c = proj.classBuilder().build();
    p = c.attributeBuilder().build();
    expect(p.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a property without a stereotype if `allowsTrue = true`', () => {
    c = proj.classBuilder().build();
    p = c.attributeBuilder().build();
    expect(p.hasValidStereotype(true)).toBeTrue();
  });

  it('should return false for a property with a custom stereotype', () => {
    c = proj.classBuilder().build();
    p = c.attributeBuilder().stereotype('asd').build();

    expect(p.hasValidStereotype()).toBeFalse();
  });

  it('should return true for a property stereotyped as «begin»', () => {
    c = proj.classBuilder().build();
    p = c.attributeBuilder().begin().build();

    expect(p.hasValidStereotype()).toBeTrue();
  });
});
