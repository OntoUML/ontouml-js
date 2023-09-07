import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Project
} from '../../src';

describe(`Generalization tests`, () => {
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
    agentSet = proj.generalizationSetBuilder().generalizations(genPer).build();

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
      .build();
  });

  describe(`Test ${Generalization.prototype.toJSON.name}()`, () => {
    it('should serialize generalization without throwing an exception', () =>
      expect(() => JSON.stringify(genPer)).not.toThrow());
  });

  describe(`Test cross reference of generalization sets`, () => {
    it('should retrieve agentSet from genPer', () => {
      expect(genPer.generalizationSets).toIncludeSameMembers([agentSet]);
    });

    it('should retrieve agentSet from genOrg', () => {
      expect(genPer.generalizationSets).toIncludeSameMembers([agentSet]);
    });

    it('should retrieve relSet from genFriendOf', () => {
      expect(genFriendOf.generalizationSets).toIncludeSameMembers([relSet]);
    });
  });

  describe(`Test ${Generalization.prototype.involvesClasses.name}()`, () => {
    it('should return true when the both the general and the specific are classes', () => {
      expect(genPer.involvesClasses()).toBeTrue();
    });

    it('should return true when the both the general and the specific are relations', () => {
      expect(genFriendOf.involvesClasses()).toBeFalse();
    });
  });

  describe(`Test ${Generalization.prototype.involvesRelations.name}()`, () => {
    it('should return true when the both the general and the specific are relations', () => {
      expect(genPer.involvesRelations()).toBeFalse();
    });

    it('should return true when the both the general and the specific are classes', () => {
      expect(genFriendOf.involvesRelations()).toBeTrue();
    });
  });

  describe(`Test ${Generalization.prototype.clone.name}()`, () => {
    it('cloned generalization should be qualitatively equal', () => {
      const genClone = genPer.clone();
      expect(genClone).toEqual(genPer);
    });
  });
});
