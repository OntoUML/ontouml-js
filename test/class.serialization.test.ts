import {describe, expect, it, beforeEach} from '@jest/globals';
import { ClassStereotype, OntologicalNature, ORDERLESS_LEVEL, Package, Project } from '../src';

describe('Test Class serialization', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('Test empty class serialization', () => {
    const emptyClass = model.createClass();
    const serialization = emptyClass.toJSON();

    expect(serialization.stereotype).toEqual(null);
    expect(serialization.restrictedTo).toEqual(null);
    expect(serialization.properties).toEqual(null);
    expect(serialization.literals).toEqual(null);
    expect(serialization.isAbstract).toEqual(false);
    expect(serialization.isDerived).toEqual(false);
    expect(serialization.isExtensional).toEqual(false);
    expect(serialization.isPowertype).toEqual(false);
    expect(serialization.order).toEqual('1');
  });

  it('Test fully featured category serialization', () => {
    const fullyFeaturedCategory = model.createCategory('category', OntologicalNature.functional_complex, {
      isAbstract: true,
      isDerived: true,
      isExtensional: true,
      isPowertype: true,
      order: ORDERLESS_LEVEL
    });
    const enumeration = model.createEnumeration();
    const attribute = fullyFeaturedCategory.createAttribute(enumeration);
    const serialization = fullyFeaturedCategory.toJSON();

    expect(serialization.stereotype).toContain(ClassStereotype.CATEGORY);
    expect(serialization.restrictedTo).toContain(OntologicalNature.functional_complex);
    expect(serialization.properties).toContain(attribute);
    expect(serialization.literals).toEqual(null);
    expect(serialization.isAbstract).toEqual(true);
    expect(serialization.isDerived).toEqual(true);
    expect(serialization.isExtensional).toEqual(true);
    expect(serialization.isPowertype).toEqual(true);
    expect(serialization.order).toEqual('*');
  });

  it('Test enumeration serialization', () => {
    const enumeration = model.createEnumeration();
    const literal = enumeration.createLiteral();
    const serialization = enumeration.toJSON();

    expect(serialization.stereotype).toContain(ClassStereotype.ENUMERATION);
    expect(serialization.restrictedTo).toContain(OntologicalNature.abstract);
    expect(serialization.properties).toEqual(null);
    expect(serialization.literals).toContain(literal);
  });

  it('Test classes serialization within project', () => {
    expect(() => JSON.stringify(project)).not.toThrow();
  });

});
