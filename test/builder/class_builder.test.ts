import { Class, Project } from '../../src';
import { ClassBuilder } from '../../src/builder/model/class_builder';

describe(`${ClassBuilder.name} Tests`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe('Test defaults', () => {
    beforeEach(() => {
      clazz = proj.classBuilder().build();
    });

    it('Class should be created without a container', () => {
      expect(clazz.container).toBeUndefined();
    });

    it('Class should be created with a reference to the project', () => {
      expect(clazz.project).toBe(proj);
    });

    it('Class should be created with stereotype = undefined', () => {
      expect(clazz.stereotype).toBeUndefined();
    });

    it('Class should be created with an empty restrictedTo array', () => {
      expect(clazz.restrictedTo).toHaveLength(0);
    });

    it('Class should be created with an empty array of literals', () => {
      expect(clazz.literals).toEqual([]);
    });

    it('Class should be created with an empty array of properties', () => {
      expect(clazz.properties).toEqual([]);
    });

    it('Class should be created with isAbstract = false', () => {
      expect(clazz.isAbstract).toEqual(false);
    });

    it('Class should be created with isDerived = false', () => {
      expect(clazz.isDerived).toEqual(false);
    });

    it('Class should be created with isPowertype = false', () => {
      expect(clazz.isPowertype).toEqual(false);
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });
});
