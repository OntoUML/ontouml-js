import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation,
  serializationUtils
} from '../../src';

describe(`GeneralizationSet Tests`, () => {
  let proj: Project;
  let agent: Class, person: Class, organization: Class;
  let knows: BinaryRelation, friendOf: BinaryRelation;
  let genPer: Generalization,
    genOrg: Generalization,
    genFriendOf: Generalization;
  let agentSet: GeneralizationSet, relSet: GeneralizationSet;

  beforeEach(() => {
    proj = new Project();

    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    organization = proj.classBuilder().kind().build();

    genPer = person.addParent(agent);
    genOrg = organization.addParent(agent);
    agentSet = proj
      .generalizationSetBuilder()
      .generalizations(genPer, genOrg)
      .disjoint()
      .complete()
      .build();

    knows = proj
      .binaryRelationBuilder()
      .material()
      .source(agent)
      .target(agent)
      .build();

    friendOf = proj
      .binaryRelationBuilder()
      .material()
      .source(person)
      .target(person)
      .build();

    genFriendOf = friendOf.addParent(knows);

    relSet = proj
      .generalizationSetBuilder()
      .generalizations(genFriendOf)
      .overlapping()
      .incomplete()
      .build();
  });

  describe(`Test isPartition()`, () => {
    it('should be false if isDisjoint: false', () => {
      agentSet.isDisjoint = false;
      agentSet.isComplete = true;
      expect(agentSet.isPartition()).toBeFalse();
    });

    it('should be false if isComplete: false', () => {
      agentSet.isDisjoint = true;
      agentSet.isComplete = false;
      expect(agentSet.isPartition()).toBeFalse();
    });

    it('should be false if isDisjoint: false and isComplete: false', () => {
      agentSet.isDisjoint = false;
      agentSet.isComplete = false;
      expect(agentSet.isPartition()).toBeFalse();
    });

    it('should be true if isDisjoint: true and isComplete: true', () => {
      agentSet.isDisjoint = true;
      agentSet.isComplete = true;
      expect(agentSet.isPartition()).toBeTrue();
    });
  });

  describe(`Test getGeneral()`, () => {
    it('should return the classifier set as the general in all generalizations within the generalization set (1 gen)', () => {
      expect(relSet.getGeneral()).toBe(knows);
    });

    it('should return the classifier set as the general in all generalizations within the generalization set (2 gens)', () => {
      expect(agentSet.getGeneral()).toBe(agent);
    });

    it('should throw an exception if there is more than one general in the generalizations within the generalization set', () => {
      const gs = proj
        .generalizationSetBuilder()
        .generalizations(genPer, genOrg, genFriendOf)
        .build();

      expect(() => gs.getGeneral()).toThrow();
    });
  });

  describe(`Test getSpecifics()`, () => {
    it('Should return all specifics (1 gens)', () => {
      const specifics = relSet.getSpecifics();
      expect(specifics).toIncludeSameMembers([friendOf]);
    });

    it('Should return all specifics (2 gens)', () => {
      const specifics = agentSet.getSpecifics();
      expect(specifics).toIncludeSameMembers([person, organization]);
    });

    it('Should not return duplicates', () => {
      const duplicateGen = proj
        .generalizationBuilder()
        .general(agent)
        .specific(organization)
        .build();
      agentSet.addGeneralization(duplicateGen);

      const specifics = agentSet.getSpecifics();
      expect(specifics).toIncludeSameMembers([person, organization]);
    });
  });

  describe(`Test getInvolvedClassifiers()`, () => {
    it('should return common general and all specifics (with classes and 2 gens)', () => {
      expect(agentSet.getInvolvedClassifiers()).toIncludeSameMembers([
        agent,
        person,
        organization
      ]);
    });

    it('should return common general and all specifics (with relations and 1 gen)', () => {
      expect(relSet.getInvolvedClassifiers()).toIncludeSameMembers([
        knows,
        friendOf
      ]);
    });
  });

  describe(`Test involvesClasses()`, () => {
    it('should return true if all the involved classifiers are classes', () => {
      expect(agentSet.involvesClasses()).toBeTrue();
    });

    it('should return false if at least one involved classifier is not a class', () => {
      expect(relSet.involvesClasses()).toBeFalse();
    });
  });

  describe(`Test involvesRelations()`, () => {
    it('should return true if all the involved classifiers are relations', () => {
      expect(agentSet.involvesRelations()).toBeFalse();
    });

    it('should return false if at least one involved classifier is not a relation', () => {
      expect(relSet.involvesRelations()).toBeTrue();
    });
  });

  describe(`Test clone()`, () => {
    it('Cloned generalization set should equal source', () => {
      const clone = agentSet.clone();
      agentSet.getInstantiationRelations;
      expect(clone).toEqual(agentSet);
    });
  });

  describe(`Test getInstantiationRelations()`, () => {
    // TODO: implement test
  });

  it(`Test setContainer()`, () => {
    const pkg = proj.packageBuilder().build();
    pkg.addContent(agentSet);

    expect(agentSet.container).toBe(pkg);
    expect(pkg.contents).toContain(agentSet);
  });

  describe(`Test toJSON()`, () => {
    it('should serialize generalization set without throwing an exception', () => {
      expect(() => JSON.stringify(agentSet)).not.toThrow();
    });
  });
});
