import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Project } from '../../src';

const schema = require('ontouml-schema');

describe('Test Class serialization', () => {
  const ajv = new Ajv();
  const validator = addFormats(ajv).compile(schema);

  it('The minimum generalization builder should generate a valid generalizations', () => {
    const proj = new Project();
    const child = proj.classBuilder().build();
    const parent = proj.classBuilder().build();
    const gen = proj
      .generalizationBuilder()
      .general(parent)
      .specific(child)
      .build();

    expect(validator(gen.toJSON())).toBeTruthy();
  });
});
