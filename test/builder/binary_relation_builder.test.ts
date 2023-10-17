import { AggregationKind, BinaryRelation, Class, Project } from '../../src';

describe(`Binary relation builder`, () => {
  let proj: Project;
  let clazz: Class;
  let rel: BinaryRelation;

  beforeEach(() => {
    proj = new Project();
    clazz = proj.classBuilder().build();
  });

  describe(`Test defaults`, () => {
    beforeEach(() => {
      rel = proj.binaryRelationBuilder().source(clazz).target(clazz).build();
    });

    it('should set the project', () => {
      expect(rel.project).toBe(proj);
    });

    it('should create binary relation', () => {
      expect(rel.isBinary()).toBeTrue();
    });

    it('should set the source', () => {
      expect(rel.source).toBe(clazz);
    });

    it('should set the target', () => {
      expect(rel.target).toBe(clazz);
    });

    it('should be created without a container', () => {
      expect(rel.container).toBeUndefined();
    });

    it('should set the container of the source end to be the relation', () => {
      expect(rel.sourceEnd.container).toBe(rel);
    });

    it('should set the container of the target end to be the relation', () => {
      expect(rel.targetEnd.container).toBe(rel);
    });
  });

  describe('should throw an exception when', () => {
    it('the source is not set', () => {
      expect(() => {
        proj.binaryRelationBuilder().target(clazz).build();
      }).toThrowError();
    });

    it('the target is not set', () => {
      expect(() => {
        proj.binaryRelationBuilder().source(clazz).build();
      }).toThrowError();
    });

    it('the source and the target are not set', () => {
      expect(() => {
        proj.binaryRelationBuilder().build();
      }).toThrowError();
    });
  });

  describe(`Test derivation()`, () => {
    let heavierThan: BinaryRelation;
    let weight: Class;

    beforeEach(() => {
      heavierThan = proj
        .binaryRelationBuilder()
        .source(clazz)
        .target(clazz)
        .build();

      weight = proj.classBuilder().build();
      rel = proj
        .binaryRelationBuilder()
        .derivation()
        .source(heavierThan)
        .target(weight)
        .build();
    });

    it('should create class stereotyped as «derivation»', () => {
      expect(rel.isDerivation()).toBeTrue();
    });
  });

  describe(`Test material()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .material()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «material»', () => {
      expect(rel.isMaterial()).toBeTrue();
    });
  });

  describe(`Test comparative()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .comparative()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «comparative»', () => {
      expect(rel.isComparative()).toBeTrue();
    });
  });

  describe(`Test mediation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .mediation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «mediation»', () => {
      expect(rel.isMediation()).toBeTrue();
    });
  });

  describe(`Test characterization()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .characterization()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «characterization»', () => {
      expect(rel.isCharacterization()).toBeTrue();
    });
  });

  describe(`Test externalDependence()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .externalDependence()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «externalDependence»', () => {
      expect(rel.isExternalDependence()).toBeTrue();
    });
  });

  describe(`Test componentOf()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .componentOf()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «componentOf»', () => {
      expect(rel.isComponentOf()).toBeTrue();
    });
    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test memberOf()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .memberOf()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isMemberOf()).toBeTrue();
    });

    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.SHARED);
    });
  });

  describe(`Test subCollectionOf()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .subCollectionOf()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isSubCollectionOf()).toBeTrue();
    });

    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test subQuantityOf()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .subQuantityOf()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isSubQuantityOf()).toBeTrue();
    });
    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test instantiation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .instantiation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isInstantiation()).toBeTrue();
    });
  });

  describe(`Test termination()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .termination()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isTermination()).toBeTrue();
    });
  });

  describe(`Test participational()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .participational()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isParticipational()).toBeTrue();
    });
    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test participation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .participation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «»', () => {
      expect(rel.isParticipation()).toBeTrue();
    });
  });

  describe(`Test historicalDependence()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .historicalDependence()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «historicalDependence»', () => {
      expect(rel.isHistoricalDependence()).toBeTrue();
    });
  });

  describe(`Test creation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .creation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «creation»', () => {
      expect(rel.isCreation()).toBeTrue();
    });
  });

  describe(`Test manifestation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .manifestation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «manifestation»', () => {
      expect(rel.isManifestation()).toBeTrue();
    });
  });

  describe(`Test bringsAbout()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .bringsAbout()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «bringsAbout»', () => {
      expect(rel.isBringsAbout()).toBeTrue();
    });
  });

  describe(`Test triggers()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .triggers()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation stereotyped as «triggers»', () => {
      expect(rel.isTriggers()).toBeTrue();
    });
  });

  describe(`Test composition()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .composition()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation without stereotype', () => {
      expect(rel.stereotype).toBeUndefined();
    });

    it('should set the aggregation kind on the target end to COMPOSITE', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test aggregation()`, () => {
    beforeEach(() => {
      rel = proj
        .binaryRelationBuilder()
        .aggregation()
        .source(clazz)
        .target(clazz)
        .build();
    });

    it('should create relation without stereotype', () => {
      expect(rel.stereotype).toBeUndefined();
    });

    it('should set the aggregation kind on the target end to SHARED', () => {
      expect(rel.targetEnd.aggregationKind).toBe(AggregationKind.SHARED);
    });
  });
});
