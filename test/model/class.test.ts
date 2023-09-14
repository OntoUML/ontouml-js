import { Class, Package, Project } from '../../src';

describe(`${Class.name} Tests`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe(`Test ${Class.prototype.getContents.name}()`, () => {
    it('clazz.getContents() should return an empty array if the class has no attributes or literals', () => {
      clazz = proj.classBuilder().build();
      const contents = clazz.getContents();

      expect(contents).toEqual([]);
    });

    it('clazz.getContents() should return an array containing exactly the one attribute of the class', () => {
      clazz = proj.classBuilder().build();
      const attribute = clazz.attributeBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toEqual([attribute]);
    });

    it('clazz.getContents() should return an array containing exactly the two attributes of the class', () => {
      clazz = proj.classBuilder().build();
      const attribute1 = clazz.attributeBuilder().build();
      const attribute2 = clazz.attributeBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([attribute1, attribute2]);
    });

    it('clazz.getContents() should return an array containing exactly the one literal of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const literal = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toEqual([literal]);
    });

    it('clazz.getContents() should return an array containing exactly the two literals of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const literal1 = clazz.literalBuilder().build();
      const literal2 = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([literal1, literal2]);
    });

    it('clazz.getContents() should return the attributes and the literals of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const attribute = clazz.attributeBuilder().build();
      const literal = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([attribute, literal]);
    });
  });

  describe(`Test ${Class.prototype.getAllContents.name}()`, () => {
    it('clazz.getAllContents() should return the same values as getContents()', () => {
      clazz = proj.classBuilder().enumeration().build();
      clazz.attributeBuilder().build();
      clazz.literalBuilder().build();

      const contents = clazz.getContents();
      const allContents = clazz.getAllContents();
      expect(allContents).toIncludeSameMembers(contents);
    });
  });

  describe(`Test setting container`, () => {
    let projA: Project;
    let pkgA: Package, pkgB: Package;
    let clazz: Class;

    beforeEach(() => {
      projA = new Project();
      pkgA = projA.packageBuilder().build();
      clazz = projA.classBuilder().build();
      pkgB = projA.packageBuilder().build();
    });

    it('clazz should have no container', () => {
      expect(clazz.container).toBeUndefined();
    });

    it('addContent should set the given package as the container', () => {
      pkgA.addContent(clazz);
      expect(clazz.container).toBe(pkgA);
      expect(pkgA.contents).toContain(clazz);
    });

    it('subsequent invokation of addContent should replace previous container', () => {
      pkgA.addContent(clazz);
      pkgB.addContent(clazz);
      expect(clazz.container).toBe(pkgB);
      expect(pkgB.contents).toContain(clazz);
      expect(pkgA.contents).not.toContain(clazz);
    });

    it('removeContent should set container to undefined', () => {
      pkgA.addContent(clazz);
      pkgA.removeContent(clazz);
      expect(clazz.container).toBeUndefined();
      expect(pkgA.contents).not.toContain(clazz);
    });
  });

  describe(`Test ${Class.prototype.clone.name}()`, () => {
    it('Test method', () => {
      const classA = proj.classBuilder().build();
      const classB = classA.clone();
      expect(classA).toEqual(classB);
    });
  });
});
