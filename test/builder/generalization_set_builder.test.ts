import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation
} from '../../src';

describe(`Generalization set builder tests`, () => {
  let proj: Project;
  let person: Class, man: Class, woman: Class;
  let manToPer: Generalization, womanToPer: Generalization;
  let genSet: GeneralizationSet;

  beforeEach(() => {
    proj = new Project();
    person = proj.classBuilder().name('Person').build();
    man = proj.classBuilder().name('Man').build();
    woman = proj.classBuilder().name('Woman').build();
    manToPer = proj
      .generalizationBuilder()
      .general(person)
      .specific(man)
      .build();
    womanToPer = proj
      .generalizationBuilder()
      .general(person)
      .specific(woman)
      .build();
  });

  describe(`Test default values`, () => {
    beforeEach(() => {
      genSet = proj
        .generalizationSetBuilder()
        .generalizations(manToPer, womanToPer)
        .build();
    });

    it('should create an intance of GeneralizationSet', () => {
      expect(genSet).toBeInstanceOf(GeneralizationSet);
    });

    it('should have an undefined container', () => {
      expect(genSet.container).toBeUndefined();
    });

    it('should set the project', () => {
      expect(genSet.project).toBe(proj);
    });

    it('should contain both generalizations', () => {
      expect(genSet.generalizations).toIncludeSameMembers([
        manToPer,
        womanToPer
      ]);
    });
  });

  describe(`Test partition()`, () => {
    beforeEach(() => {
      genSet = proj
        .generalizationSetBuilder()
        .partition()
        .generalizations(manToPer, womanToPer)
        .build();
    });

    it('should be disjoint', () => {
      expect(genSet.isDisjoint).toBeTrue();
    });

    it('should be complete', () => {
      expect(genSet.isComplete).toBeTrue();
    });
  });
});
