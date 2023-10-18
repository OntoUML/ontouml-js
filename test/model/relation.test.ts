import { Project, AggregationKind } from '../../src';

describe('Relation Tests', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();

  const knows = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const introducedTo = proj
    .naryRelationBuilder()
    .members(person, person, person)
    .build();

  describe('Test getContents()', () => {
    it('should only include its properties', () => {
      expect(knows.getContents()).toIncludeSameMembers(knows.properties);
    });
  });

  describe('Test getAllContents()', () => {
    it('should only include its properties', () => {
      expect(knows.getAllContents()).toContain(knows.targetEnd);
    });
  });

  describe('Test isBinary()', () => {
    it('should be true for instances of BinaryRelation', () => {
      expect(knows.isBinary()).toBeTrue();
    });
    it('should be false for instances of NaryRelation', () => {
      expect(introducedTo.isBinary()).toBeFalse();
    });
  });

  describe('Test isTernary()', () => {
    it('should be true for instances of BinaryRelation', () => {
      expect(knows.isNary()).toBeFalse();
    });
    it('should be false for instances of NaryRelation', () => {
      expect(introducedTo.isNary()).toBeTrue();
    });
  });

  describe('Test isPartWholeRelation()', () => {
    const partOf = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    it('should be true if aggregation kind is set to SHARED only on target end', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.NONE;
      partOf.targetEnd.aggregationKind = AggregationKind.SHARED;
      expect(partOf.isPartWholeRelation()).toBeTrue();
    });

    it('should be true if aggregation kind is set to COMPOSITE only on target end', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.NONE;
      partOf.targetEnd.aggregationKind = AggregationKind.COMPOSITE;
      expect(partOf.isPartWholeRelation()).toBeTrue();
    });

    it('should be false if aggregation kind is set to SHARED only on source end', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.SHARED;
      partOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(partOf.isPartWholeRelation()).toBeFalse();
    });

    it('should be false if aggregation kind is set to COMPOSITE only on source end', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.COMPOSITE;
      partOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(partOf.isPartWholeRelation()).toBeFalse();
    });

    it('should be false if aggregation kind is set to SHARED on both ends', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.SHARED;
      partOf.targetEnd.aggregationKind = AggregationKind.SHARED;
      expect(partOf.isPartWholeRelation()).toBeFalse();
    });

    it('should be false if aggregation kind is set to COMPOSITE on both ends', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.COMPOSITE;
      partOf.targetEnd.aggregationKind = AggregationKind.COMPOSITE;
      expect(partOf.isPartWholeRelation()).toBeFalse();
    });

    it('should be false if the aggregation kind is set to NONE on both ends', () => {
      partOf.sourceEnd.aggregationKind = AggregationKind.NONE;
      partOf.targetEnd.aggregationKind = AggregationKind.NONE;
      expect(partOf.isPartWholeRelation()).toBeFalse();
    });
  });

  describe('Test isExistentialDependence()', () => {
    it('should be false if both ends are not isReadOnly', () => {
      knows.sourceEnd.isReadOnly = false;
      knows.targetEnd.isReadOnly = false;
      expect(knows.isExistentialDependence()).toBeFalse();
    });

    it('should be true if source end is isReadOnly', () => {
      knows.sourceEnd.isReadOnly = true;
      knows.targetEnd.isReadOnly = false;
      expect(knows.isExistentialDependence()).toBeTrue();
    });

    it('should be false if target end is isReadOnly', () => {
      knows.sourceEnd.isReadOnly = false;
      knows.targetEnd.isReadOnly = true;
      expect(knows.isExistentialDependence()).toBeTrue();
    });

    it('should be false if both ends are isReadOnly', () => {
      knows.sourceEnd.isReadOnly = true;
      knows.targetEnd.isReadOnly = true;
      expect(knows.isExistentialDependence()).toBeTrue();
    });
  });

  describe('Test holdsBetweenEvents()', () => {
    const player = proj.classBuilder().role().build();
    const soccerMatch = proj.classBuilder().event().build();
    const goal = proj.classBuilder().event().build();

    const isPartOfMatch = proj
      .binaryRelationBuilder()
      .composition()
      .source(goal)
      .target(soccerMatch)
      .build();

    const scored = proj
      .binaryRelationBuilder()
      .participation()
      .source(player)
      .target(goal)
      .build();

    it('should return true if the classes connected on both ends are decorated as «event»', () => {
      expect(isPartOfMatch.holdsBetweenEvents()).toBeTrue();
    });

    it('should return false if only the source class is decorated as «event»', () => {
      expect(scored.holdsBetweenEvents()).toBeFalse();
    });
  });

  describe('Test holdsBetweenMoments()', () => {
    const intensity = proj.classBuilder().mode().build();
    const headache = proj.classBuilder().mode().build();

    const inheresIn = proj
      .binaryRelationBuilder()
      .characterization()
      .source(intensity)
      .target(headache)
      .build();

    it('should return true if the classes connected on both ends are decorated as «mode»', () => {
      expect(inheresIn.holdsBetweenMoments()).toBeTrue();
    });

    it('should return false if only the source class is decorated as «event»', () => {
      expect(knows.holdsBetweenMoments()).toBeFalse();
    });
  });
});
