import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation
} from '../../src';

describe(`Generalization builder tests`, () => {
  let proj: Project;
  let person: Class, man: Class, woman: Class;
  let manToPer: Generalization, womanToPer: Generalization;

  beforeAll(() => {
    proj = new Project();
    person = proj.classBuilder().name('Person').build();
    man = proj.classBuilder().name('Man').build();
    manToPer = proj
      .generalizationBuilder()
      .general(person)
      .specific(man)
      .build();
  });

  describe(`Test default values`, () => {
    it('should create an intance of Generalization', () => {
      expect(manToPer).toBeInstanceOf(Generalization);
    });

    it('should have an undefined container', () => {
      expect(manToPer.container).toBeUndefined();
    });

    it('should set the project', () => {
      expect(manToPer.project).toBe(proj);
    });

    it('should set the general', () => {
      expect(manToPer.general).toBe(person);
    });

    it('should set the specific', () => {
      expect(manToPer.specific).toBe(man);
    });
  });
});
