import { Class, Generalization, Project, Relation } from '../../src';

describe(`Nary relation builder tests`, () => {
  let proj: Project;
  let relation: Relation;
  let memberA: Class, memberB: Class, memberC: Class;

  beforeEach(() => {
    proj = new Project();
    memberA = proj.classBuilder().build();
    memberB = proj.classBuilder().build();
    memberC = proj.classBuilder().build();
    // TODO: After implementing nary relation builder
    // relation = proj.naryRelationBuilder()([memberA, memberB, memberC]);
  });

  describe(`Test createTernaryRelation()`, () => {
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
      gen = model
        .generalizationBuilder()
        .general(general)
        .specific(specific)
        .build();
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
});
