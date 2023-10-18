import {
  AggregationKind,
  BEGIN,
  BinaryRelation,
  Class,
  Project,
  Property
} from '../../src';

describe(`Attribute tests`, () => {
  let proj: Project;
  let date: Class, concert: Class;
  let start: Property;
  let isPartOf: BinaryRelation;

  beforeEach(() => {
    proj = new Project();
    date = proj.classBuilder().datatype().build();
    concert = proj.classBuilder().event().build();
    start = concert.propertyBuilder().type(date).build();
    isPartOf = proj
      .binaryRelationBuilder()
      .source(concert)
      .target(concert)
      .aggregation()
      .build();
  });

  describe(`Test ${Property.prototype.hasValidStereotype.name}()`, () => {
    it('should return false for an attribute without a stereotype', () => {
      expect(start.hasValidStereotype()).toBeFalse();
    });

    it('should return true for an attribute stereotyped as «begin»', () => {
      start.stereotype = BEGIN;
      expect(start.hasValidStereotype()).toBeTrue();
    });

    it('should return false for an decorated with a custom stereotype', () => {
      start.stereotype = 'my-stereotype' as any;
      expect(start.hasValidStereotype()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.isAttribute.name}()`, () => {
    it('should return true for a property owned by a class', () => {
      expect(start.isAttribute()).toBeTrue();
    });

    it('should return false for a property owned by a relation', () => {
      expect(isPartOf.sourceEnd.isAttribute()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.isRelationEnd.name}()`, () => {
    it('should return false for a property owned by a class', () => {
      expect(start.isRelationEnd()).toBeFalse();
    });

    it('should return true for a property owned by a relation', () => {
      expect(isPartOf.sourceEnd.isRelationEnd()).toBeTrue();
    });
  });

  describe(`Test ${Property.prototype.hasPropertyType.name}()`, () => {
    it('should return true if the property type is set', () => {
      expect(start.hasPropertyType()).toBeTrue();
    });

    it('should return false if the property type is undefined', () => {
      start.propertyType = undefined;
      expect(start.hasPropertyType()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.isShared.name}()`, () => {
    it('should return true if aggregation kind = SHARED', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.SHARED;
      expect(isPartOf.targetEnd.isShared()).toBeTrue();
    });

    it('should return false if aggregation kind = COMPOSITE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.COMPOSITE;
      expect(isPartOf.targetEnd.isShared()).toBeFalse();
    });

    it('should return false if aggregation kind = NONE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(isPartOf.targetEnd.isShared()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.isComposite.name}()`, () => {
    it('should return true if aggregation kind = SHARED', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.SHARED;
      expect(isPartOf.targetEnd.isComposite()).toBeFalse();
    });

    it('should return false if aggregation kind = COMPOSITE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.COMPOSITE;
      expect(isPartOf.targetEnd.isComposite()).toBeTrue();
    });

    it('should return false if aggregation kind = NONE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(isPartOf.targetEnd.isComposite()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.isWholeEnd.name}()`, () => {
    it('should return true if aggregation kind = SHARED', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.SHARED;
      expect(isPartOf.targetEnd.isWholeEnd()).toBeTrue();
    });

    it('should return true if aggregation kind = COMPOSITE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.COMPOSITE;
      expect(isPartOf.targetEnd.isWholeEnd()).toBeTrue();
    });

    it('should return false if aggregation kind = NONE', () => {
      isPartOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(isPartOf.targetEnd.isWholeEnd()).toBeFalse();
    });
  });

  describe(`Test ${Property.prototype.getOppositeEnd.name}()`, () => {
    it('should return target end when invoked on source end', () => {
      expect(isPartOf.sourceEnd.getOppositeEnd()).toBe(isPartOf.targetEnd);
    });

    it('should return source end when invoked on target end', () => {
      expect(isPartOf.targetEnd.getOppositeEnd()).toBe(isPartOf.sourceEnd);
    });

    it('should break when invoked on an attribute', () => {
      expect(() => start.getOppositeEnd()).toThrowError();
    });

    it('should break when invoked on a relation end of an n-ary relation', () => {
      const naryRel = proj
        .naryRelationBuilder()
        .members(concert, concert, concert)
        .build();

      expect(() => naryRel.properties[0].getOppositeEnd()).toThrowError();
    });
  });

  describe(`Test ${Property.prototype.getOtherEnds.name}()`, () => {
    it('should return an array with the target end when invoked on the source end of a binary relation', () => {
      expect(isPartOf.sourceEnd.getOtherEnds()).toIncludeSameMembers([
        isPartOf.targetEnd
      ]);
    });

    it('should return an array with the source end when invoked on the target end of a binary relation', () => {
      expect(isPartOf.targetEnd.getOtherEnds()).toIncludeSameMembers([
        isPartOf.sourceEnd
      ]);
    });

    it('should break when invoked on an attribute', () => {
      expect(() => start.getOtherEnds()).toThrowError();
    });

    it('should return the other other ends when invoked on a relation end of an n-ary relation', () => {
      const naryRel = proj
        .naryRelationBuilder()
        .members(concert, concert, concert)
        .build();

      expect(naryRel.properties[0].getOtherEnds()).toIncludeSameMembers([
        naryRel.properties[1],
        naryRel.properties[2]
      ]);
    });
  });
});
