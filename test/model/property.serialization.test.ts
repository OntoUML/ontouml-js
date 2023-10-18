import { Class, Project, Property } from '../../src';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const schema = require('ontouml-schema');

describe(`Attribute tests`, () => {
  const ajv = new Ajv();
  const validator = addFormats(ajv).compile(schema);
  let proj: Project;
  let date: Class, concert: Class;
  let start: Property;

  beforeEach(() => {
    proj = new Project();
    date = proj.classBuilder().datatype().build();
    concert = proj.classBuilder().event().build();
  });

  it(`An attribute decorated with «begin» should validate against the schema`, () => {
    start = concert.propertyBuilder().begin().build();
    expect(validator(start.toJSON())).toBeTruthy();
  });

  it(`An attribute decorated with a custom stereotype should validate against the schema`, () => {
    start = concert.propertyBuilder().stereotype('my-stereotype').build();
    expect(validator(start.toJSON())).toBeTruthy();
  });

  it(`An attribute without a stereotype should validate against the schema`, () => {
    start = concert.propertyBuilder().build();
    expect(validator(start.toJSON())).toBeTruthy();
  });
});
