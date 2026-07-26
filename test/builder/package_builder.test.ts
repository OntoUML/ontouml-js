import { Package, Project } from '../../src';

describe(`Package tests`, () => {
  let proj: Project;
  let model: Package;

  beforeEach(() => {
    proj = new Project();
    model = proj.packageBuilder().build();
  });

  describe(`Test createPackage()`, () => {
    let pkg: Package;

    beforeEach(() => {
      pkg = model.packageBuilder().build();
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
});
