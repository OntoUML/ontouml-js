import {
  Class,
  Project,
  Package,
  Generalization,
  GeneralizationSet
} from '../../src';

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
