import { BinaryRelation, Class, Package, Project } from '../../src';

describe('Binary relation tests', () => {
  let proj: Project;
  let pkg: Package;
  let person: Class, organization: Class, employment: Class, mood: Class;

  beforeEach(() => {
    proj = new Project();
    pkg = proj.packageBuilder().build();
    person = pkg.classBuilder().kind().name('Person').build();
    organization = pkg.classBuilder().kind().name('Organization').build();
    employment = pkg.classBuilder().relator().name('Employment').build();
    mood = pkg.classBuilder().mode().name('Mood').build();
  });

  function buildRelation(stereotype: string): BinaryRelation {
    return pkg
      .binaryRelationBuilder()
      .stereotype(stereotype)
      .source(person)
      .target(organization)
      .build();
  }

  describe('Test stereotype predicates', () => {
    const cases: [string, (r: BinaryRelation) => boolean][] = [
      ['material', r => r.isMaterial()],
      ['comparative', r => r.isComparative()],
      ['mediation', r => r.isMediation()],
      ['characterization', r => r.isCharacterization()],
      ['externalDependence', r => r.isExternalDependence()],
      ['componentOf', r => r.isComponentOf()],
      ['memberOf', r => r.isMemberOf()],
      ['subCollectionOf', r => r.isSubCollectionOf()],
      ['subQuantityOf', r => r.isSubQuantityOf()],
      ['instantiation', r => r.isInstantiation()],
      ['termination', r => r.isTermination()],
      ['participational', r => r.isParticipational()],
      ['participation', r => r.isParticipation()],
      ['historicalDependence', r => r.isHistoricalDependence()],
      ['creation', r => r.isCreation()],
      ['manifestation', r => r.isManifestation()],
      ['bringsAbout', r => r.isBringsAbout()],
      ['triggers', r => r.isTriggers()],
      ['derivation', r => r.isDerivation()]
    ];

    it.each(cases)(
      'a «%s» relation should be recognized by its predicate',
      (stereotype, predicate) => {
        expect(predicate(buildRelation(stereotype))).toBeTrue();
      }
    );

    it('a «material» relation should not be recognized by other predicates', () => {
      const relation = buildRelation('material');

      expect(relation.isMaterial()).toBeTrue();
      expect(relation.isMediation()).toBeFalse();
      expect(relation.isDerivation()).toBeFalse();
    });
  });

  describe('Test source and target accessors', () => {
    it('should expose source and target classifiers', () => {
      const worksFor = buildRelation('material');

      expect(worksFor.source).toBe(person);
      expect(worksFor.target).toBe(organization);
      expect(worksFor.getSourceAsClass()).toBe(person);
      expect(worksFor.getTargetAsClass()).toBe(organization);
      expect(worksFor.isSourceClass()).toBeTrue();
      expect(worksFor.isTargetClass()).toBeTrue();
      expect(worksFor.holdsBetweenClasses()).toBeTrue();
    });
  });

  describe('Test mediation accessors', () => {
    it('should expose the relator and the mediated class', () => {
      const involves = pkg
        .binaryRelationBuilder()
        .mediation()
        .source(employment)
        .target(person)
        .build();

      expect(involves.getRelator()).toBe(employment);
      expect(involves.getRelatorEnd()).toBe(involves.sourceEnd);
      expect(involves.getMediatedClass()).toBe(person);
      expect(involves.getMediatedEnd()).toBe(involves.targetEnd);
    });

    it('should throw when the relation is not a mediation', () => {
      const worksFor = buildRelation('material');
      expect(() => worksFor.getRelator()).toThrow();
      expect(() => worksFor.getMediatedClass()).toThrow();
    });
  });

  describe('Test characterization accessors', () => {
    it('should expose the characterizer and the bearer', () => {
      const characterizes = pkg
        .binaryRelationBuilder()
        .characterization()
        .source(mood)
        .target(person)
        .build();

      expect(characterizes.getCharacterizer()).toBe(mood);
      expect(characterizes.getBearer()).toBe(person);
    });
  });

  describe('Test derivation accessors', () => {
    it('should expose the derived relation and its truthmaker', () => {
      const worksFor = buildRelation('material');
      const derivation = pkg
        .binaryRelationBuilder()
        .derivation()
        .source(worksFor)
        .target(employment)
        .build();

      expect(derivation.getDerivedRelation()).toBe(worksFor);
      expect(derivation.getTruthmaker()).toBe(employment);
      expect(derivation.fromRelationToClass()).toBeTrue();
    });
  });

  describe('Test part-whole accessors', () => {
    it('should expose the part and the whole', () => {
      const componentOf = pkg
        .binaryRelationBuilder()
        .componentOf()
        .source(person)
        .target(organization)
        .build();

      expect(componentOf.isPartWholeRelation()).toBeTrue();
      expect(componentOf.getPart()).toBe(person);
      expect(componentOf.getWholeClass()).toBe(organization);
    });
  });

  describe('Test hasDependenceStereotype()', () => {
    it('should be true for «mediation» and false for «material»', () => {
      expect(buildRelation('mediation').hasDependenceStereotype()).toBeTrue();
      expect(buildRelation('material').hasDependenceStereotype()).toBeFalse();
    });
  });
});
