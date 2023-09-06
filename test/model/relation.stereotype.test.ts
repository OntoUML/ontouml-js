import { COMPARATIVE, MATERIAL, Project, RelationStereotype } from '../../src';

describe('Tests related to relations and stereotypes', () => {
  const proj = new Project();
  const person = proj.classBuilder().kind().build();
  const weight = proj.classBuilder().quality().build();

  const plainRelation = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const customRelation = proj
    .binaryRelationBuilder()
    .stereotype('my-stereotype')
    .source(person)
    .target(person)
    .build();

  const worksFor = proj
    .binaryRelationBuilder()
    .material()
    .source(person)
    .target(person)
    .build();

  const inheresIn = proj
    .binaryRelationBuilder()
    .characterization()
    .source(weight)
    .target(person)
    .build();

  describe('Test isStereotypeValid()', () => {
    it('should return true for a relation stereotyped as «material»', () => {
      expect(worksFor.hasValidStereotype()).toBeTrue();
    });

    it('should return true for a relation stereotyped as «characterization»', () => {
      expect(worksFor.hasValidStereotype()).toBeTrue();
    });

    it('should return true for a relation without a stereotype (allowsNone: true)', () => {
      expect(plainRelation.hasValidStereotype(true)).toBeTrue();
    });

    it('should return false for a relation without a stereotype (allowsNone: false)', () => {
      expect(plainRelation.hasValidStereotype(false)).toBeFalse();
    });

    it('should return false for a relation stereotyped as «my-stereotype»', () => {
      expect(customRelation.hasValidStereotype()).toBeFalse();
    });
  });

  describe('Test isStereotypeOneOf()', () => {
    it('should be true if the the relation stereotype is provided', () => {
      expect(worksFor.isStereotypeOneOf([MATERIAL, COMPARATIVE])).toBeTrue();
    });

    it('should be false if no stereotype is provided', () => {
      expect(worksFor.isStereotypeOneOf([])).toBeFalse();
    });
  });

  describe('Test isExistentialDependence()', () => {
    it('should be false for a «material» relation', () => {
      expect(worksFor.isExistentialDependence()).toBeFalse();
    });

    it('should be true for a «characterizatrion» relation', () => {
      expect(inheresIn.isExistentialDependence()).toBeTrue();
    });
  });

  describe('Test isMaterial()', () => {
    it('should be true for a «material» relation', () => {
      expect(worksFor.isMaterial()).toBeTrue();
    });

    it('should be false for a «characterizatrion» relation', () => {
      expect(inheresIn.isMaterial()).toBeFalse();
    });
  });

  describe('Test isCharacterization()', () => {
    it('should be false for a «material» relation', () => {
      expect(worksFor.isCharacterization()).toBeFalse();
    });

    it('should be true for a «characterizatrion» relation', () => {
      expect(inheresIn.isCharacterization()).toBeTrue();
    });
  });
});
