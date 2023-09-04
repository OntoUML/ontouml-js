import { Class, Property, Project } from '../../src';
import { AttributeBuilder } from '../../src/builder/model/attribute_builder';

describe(`${AttributeBuilder.name} Tests`, () => {
  let proj: Project;
  let clazz: Class;
  let attr: Property;

  beforeEach(() => {
    proj = new Project();
    clazz = proj.classBuilder().category().build();
    attr = clazz.attributeBuilder().build();
  });

  describe(`Test defaults`, () => {
    it("Attribute should be added to the class' properties field", () => {
      expect(clazz.properties).toContain(attr);
    });

    it('Attribute should have the class as its container', () => {
      expect(attr.container).toBe(clazz);
    });

    it('Attribute should have the same project as its container', () => {
      expect(attr.project).toBe(clazz.project);
    });

    it('Attribute should be created with isDerived = false', () => {
      expect(attr.isDerived).toBeFalse();
    });

    it('Attribute should be created with isReadOnly = false', () => {
      expect(attr.isReadOnly).toBeFalse();
    });

    it('Attribute should be created with isOrdered = false', () => {
      expect(attr.isOrdered).toBeFalse();
    });

    it('Attribute should be created with cardinality = 0..*', () => {
      expect(attr.cardinality.value).toEqual('0..*');
    });
  });
});
