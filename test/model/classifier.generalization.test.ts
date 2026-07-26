import { Class, Project, Generalization, GeneralizationSet } from '../../src';

describe(`${Class.name} Tests`, () => {
  let proj: Project;

  describe(`Test on model Agent <|- Person, with a generalization set`, () => {
    let agent: Class, person: Class;
    let gen: Generalization;
    let gs: GeneralizationSet;

    beforeAll(() => {
      proj = new Project();
      agent = proj.classBuilder().build();
      person = proj.classBuilder().build();
      gen = person.addParent(agent);
      gs = proj.generalizationSetBuilder().generalizations(gen).build();
    });

    it('agent.getGeneralizations() should return [ gen ]', () => {
      expect(agent.getGeneralizations()).toIncludeSameMembers([gen]);
    });

    it('agent.getGeneralizationSets() should return [ gs ]', () => {
      expect(agent.getGeneralizationSets()).toIncludeSameMembers([gs]);
    });

    it('agent.getGeneralizationsWhereGeneral() should return [ gen ]', () => {
      expect(agent.getGeneralizationsWhereGeneral()).toIncludeSameMembers([
        gen
      ]);
    });

    it('person.getGeneralizationsWhereGeneral() should return an empty array', () => {
      expect(person.getGeneralizationsWhereGeneral()).toBeEmpty();
    });

    it('agent.getGeneralizationsWhereSpecific() should return an empty array', () => {
      expect(agent.getGeneralizationsWhereSpecific()).toBeEmpty();
    });

    it('person.getGeneralizationsWhereSpecific() should return [ gen ]', () => {
      expect(person.getGeneralizationsWhereSpecific()).toIncludeSameMembers([
        gen
      ]);
    });

    it('agent.getGeneralizationSetsWhereGeneral() should return [ gen ]', () => {
      expect(agent.getGeneralizationSetsWhereGeneral()).toIncludeSameMembers([
        gs
      ]);
    });

    it('person.getGeneralizationSetsWhereGeneral() should return an empty array', () => {
      expect(person.getGeneralizationSetsWhereGeneral()).toBeEmpty();
    });

    it('agent.getGeneralizationSetsWhereSpecific() should return an empty array]', () => {
      expect(agent.getGeneralizationSetsWhereSpecific()).toBeEmpty();
    });

    it('person.getGeneralizationSetsWhereSpecific() should return [ gs ]', () => {
      expect(person.getGeneralizationSetsWhereSpecific()).toIncludeSameMembers([
        gs
      ]);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereCategorizer.name}()`, () => {
    let agent: Class, agentType: Class, person: Class, organization: Class;
    let gen1, gen2: Generalization;
    let gs: GeneralizationSet;

    beforeAll(() => {
      agent = proj.classBuilder().category().build();
      agentType = proj.classBuilder().type().build();
      person = proj.classBuilder().kind().build();
      organization = proj.classBuilder().kind().build();
      gen1 = person.addParent(agent);
      gen2 = organization.addParent(agent);

      gs = proj
        .generalizationSetBuilder()
        .generalizations(gen1, gen2)
        .categorizer(agentType)
        .build();
    });

    it('agent.getGeneralizationSetsWhereCategorizer() should return an empty array', () => {
      const gens = agent.getGeneralizationSetsWhereCategorizer();
      expect(gens).toBeEmpty();
    });

    it('agent.getGeneralizationSetsWhereCategorizer() should return an empty array', () => {
      const gens = person.getGeneralizationSetsWhereCategorizer();
      expect(gens).toBeEmpty();
    });

    it('agent.getGeneralizationSetsWhereCategorizer() should return an empty array', () => {
      const gens = organization.getGeneralizationSetsWhereCategorizer();
      expect(gens).toBeEmpty();
    });

    it('agent.getGeneralizationSetsWhereCategorizer() should return [ gs ]', () => {
      const gens = agentType.getGeneralizationSetsWhereCategorizer();
      expect(gens).toIncludeSameMembers([gs]);
    });
  });
});

describe('Relation Tests', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();

  const knows = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const friendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const gen = proj
    .generalizationBuilder()
    .general(knows)
    .specific(friendOf)
    .build();

  const gs = proj.generalizationSetBuilder().generalizations(gen).build();

  const bestFriendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const gen2 = proj
    .generalizationBuilder()
    .general(friendOf)
    .specific(bestFriendOf)
    .build();

  const gs2 = proj.generalizationSetBuilder().generalizations(gen2).build();

  describe('Test getGeneralizations()', () => {
    it('should return generalizations where the relation is the general', () => {
      expect(knows.getGeneralizations()).toIncludeSameMembers([gen]);
    });

    it('should return generalizations where the relation is the specific or the general', () => {
      expect(friendOf.getGeneralizations()).toIncludeSameMembers([gen, gen2]);
    });

    it('should return generalizations where the relation is the specific', () => {
      expect(bestFriendOf.getGeneralizations()).toIncludeSameMembers([gen2]);
    });
  });

  describe('Test getGeneralizationSets()', () => {
    it('should return generalization sets that contain at least one generalization in which the relation is the general', () => {
      expect(knows.getGeneralizationSets()).toIncludeSameMembers([gs]);
    });

    it('should return generalization sets that contain at least one generalization in which the relation is the specific or the general', () => {
      expect(friendOf.getGeneralizationSets()).toIncludeSameMembers([gs, gs2]);
    });

    it('should return generalization sets that contain at least one generalization in which the relation is the specific', () => {
      expect(bestFriendOf.getGeneralizationSets()).toIncludeSameMembers([gs2]);
    });
  });

  describe('Test getGeneralizationsWhereGeneral()', () => {
    it('should return only generalizations where the relation is the general', () => {
      expect(friendOf.getGeneralizationsWhereGeneral()).toIncludeSameMembers([
        gen2
      ]);
    });

    it('should return an empty array when there are no generalizations in which the relation is the general', () => {
      expect(bestFriendOf.getGeneralizationsWhereGeneral()).toBeEmpty();
    });
  });

  describe('Test getGeneralizationsWhereSpecific()', () => {
    it('should return only generalizations where the relation is the general', () => {
      expect(friendOf.getGeneralizationsWhereSpecific()).toIncludeSameMembers([
        gen
      ]);
    });

    it('should return an empty array when there are no generalizations in which the relation is the specific', () => {
      expect(knows.getGeneralizationsWhereSpecific()).toBeEmpty();
    });
  });

  describe('Test getGeneralizationSetsWhereGeneral()', () => {
    it('should return only generalization sets containing a generalization in which the relation is the general', () => {
      expect(friendOf.getGeneralizationSetsWhereGeneral()).toIncludeSameMembers(
        [gs2]
      );
    });

    it('should return an empty array when there are no generalization sets containing a generalization in which the relation is the general', () => {
      expect(bestFriendOf.getGeneralizationSetsWhereGeneral()).toBeEmpty();
    });
  });

  describe('Test getGeneralizationSetsWhereSpecific()', () => {
    it('should return only generalization sets containing a generalization in which the relation is the specific', () => {
      expect(
        friendOf.getGeneralizationSetsWhereSpecific()
      ).toIncludeSameMembers([gs]);
    });

    it('should return an empty array when there are no generalization sets containing a generalization in which the relation is the specific', () => {
      expect(knows.getGeneralizationSetsWhereSpecific()).toBeEmpty();
    });
  });
});
