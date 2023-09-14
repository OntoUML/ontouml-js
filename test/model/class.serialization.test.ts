import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  Class,
  ClassStereotype,
  Nature,
  ORDERLESS_LEVEL,
  Package,
  Project,
  Property
} from '../../src';

const schema = require('ontouml-schema');

describe('Test Class serialization', () => {
  const ajv = new Ajv();
  const validator = addFormats(ajv).compile(schema);
  let project: Project;
  let clazz: Class;

  beforeEach(() => {
    project = new Project();
    clazz = project.classBuilder().build();
  });

  it('The minimum class builder should generate a valid class', () => {
    expect(validator(clazz.toJSON())).toBeTruthy();
  });

  it('The minimum attribute builder should generate a valid properties', () => {
    const att = clazz.attributeBuilder().build();
    console.log(att.toJSON());
    console.log(clazz.toJSON());
    expect(validator(att.toJSON())).toBeTruthy();
    expect(validator(clazz.toJSON())).toBeTruthy();
  });

  it('The minimum literal builder should generate a valid literals', () => {
    const lit = clazz.literalBuilder().build();
    console.log(lit.toJSON());
    console.log(clazz.toJSON());
    expect(validator(lit.toJSON())).toBeTruthy();
    expect(validator(clazz.toJSON())).toBeTruthy();
  });

  it('The minimum generalization builder should generate a valid generalizations', () => {
    const clazz2 = project.classBuilder().build();
    const gen = project
      .generalizationBuilder()
      .general(clazz)
      .specific(clazz2)
      .build();
    expect(validator(gen.toJSON())).toBeTruthy();
  });

  // it('Test empty class serialization', () => {
  //   const emptyClass = proj.classBuilder().build();
  //   const serialization = emptyClass.toJSON();

  //   expect(serialization.stereotype).toEqual(null);
  //   expect(serialization.restrictedTo).toEqual(null);
  //   expect(serialization.properties).toEqual(null);
  //   expect(serialization.literals).toEqual(null);
  //   expect(serialization.isAbstract).toEqual(false);
  //   expect(serialization.isDerived).toEqual(false);
  //   expect(serialization.isExtensional).toEqual(false);
  //   expect(serialization.isPowertype).toEqual(false);
  //   expect(serialization.order).toEqual('1');
  // });

  // it('Test fully featured category serialization', () => {
  //   const fullyFeaturedCategory = model.createCategory('category', Nature.FUNCTIONAL_COMPLEX, {
  //     isAbstract: true,
  //     isDerived: true,
  //     isExtensional: true,
  //     isPowertype: true,
  //     order: ORDERLESS_LEVEL
  //   });
  //   const enumeration = model.classBuilder().enumeration().build();
  //   const attribute = fullyFeaturedCategory.createAttribute(enumeration);
  //   const serialization = fullyFeaturedCategory.toJSON();

  //   expect(serialization.stereotype).toContain(ClassStereotype.CATEGORY);
  //   expect(serialization.restrictedTo).toContain(Nature.FUNCTIONAL_COMPLEX);
  //   expect(serialization.properties).toContain(attribute);
  //   expect(serialization.literals).toEqual(null);
  //   expect(serialization.isAbstract).toEqual(true);
  //   expect(serialization.isDerived).toEqual(true);
  //   expect(serialization.isExtensional).toEqual(true);
  //   expect(serialization.isPowertype).toEqual(true);
  //   expect(serialization.order).toEqual('*');
  // });

  // it('Test enumeration serialization', () => {
  //   const enumeration = model.classBuilder().enumeration().build();
  //   const literal = enumeration.literalBuilder().build();
  //   const serialization = enumeration.toJSON();

  //   expect(serialization.stereotype).toContain(ClassStereotype.ENUMERATION);
  //   expect(serialization.restrictedTo).toContain(Nature.ABSTRACT);
  //   expect(serialization.properties).toEqual(null);
  //   expect(serialization.literals).toContain(literal);
  // });

  // it('Test classes serialization within project', () => {
  //   expect(() => JSON.stringify(project)).not.toThrow();
  // });
});
