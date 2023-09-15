import {
  AggregationKind,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation
} from '../../src';

describe(`Package tests`, () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test createPackage()`, () => {
    let pkg: Package;

    beforeEach(() => {
      pkg = model.createPackage();
    });

    it('Test instantiation', () => {
      expect(pkg).toBeInstanceOf(Package);
    });

    it('Test container', () => {
      expect(pkg.container).toBe(model);
    });

    it('Test project', () => {
      expect(pkg.project).toBe(model.project);
    });
  });

  describe(`Test createTernaryRelation()`, () => {
    let relation: Relation;
    let memberA: Class, memberB: Class, memberC: Class;

    beforeEach(() => {
      memberA = proj.classBuilder().build();
      memberB = proj.classBuilder().build();
      memberC = proj.classBuilder().build();
      relation = model.createNaryRelation([memberA, memberB, memberC]);
    });

    it('relation should be ternary', () => {
      expect(relation.isNary()).toBeTrue();
    });

    it('relation should have the correct first member', () => {
      expect(relation.getMember(0)).toBe(memberA);
    });

    it('relation should have the correct second member', () => {
      expect(relation.getMember(1)).toBe(memberB);
    });

    it('relation should have the correct third member', () => {
      expect(relation.getMember(2)).toBe(memberC);
    });
  });

  describe(`Test createGeneralization()`, () => {
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = proj.classBuilder().build();
      specific = proj.classBuilder().build();
      gen = model.createGeneralization(general, specific);
    });

    it('Test instantiation', () => {
      expect(gen).toBeInstanceOf(Generalization);
    });

    it('Test container', () => {
      expect(gen.container).toBe(model);
    });

    it('Test project', () => {
      expect(gen.project).toBe(model.project);
    });
  });

  describe(`Test createGeneralizationSet()`, () => {
    let genSet: GeneralizationSet;
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = proj.classBuilder().build();
      specific = proj.classBuilder().build();
      gen = model.createGeneralization(general, specific);
      genSet = model.createGeneralizationSet(gen);
    });

    it('Test instantiation', () => {
      expect(genSet).toBeInstanceOf(GeneralizationSet);
    });

    it('Test container', () => {
      expect(genSet.container).toBe(model);
    });

    it('Test project', () => {
      expect(genSet.project).toBe(model.project);
    });
  });

  describe(`Test createPartition()`, () => {
    let genSet: GeneralizationSet;
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = proj.classBuilder().build();
      specific = proj.classBuilder().build();
      gen = model.createGeneralization(general, specific);
      genSet = model.createPartition(gen);
    });

    it('Test container', () => {
      expect(genSet.isDisjoint && genSet.isComplete).toBeTrue();
    });
  });
});
