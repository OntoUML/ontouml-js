import schema from './schema.json';
import { Project } from './';
import Ajv from 'ajv';

Object.freeze(schema);

const ajv = new Ajv();
const validator = ajv.compile(schema);

function validate(project: Project): true | object | PromiseLike<any>;
function validate(serializedProject: object): true | object | PromiseLike<any>;
function validate(serializedProject: string): true | object | PromiseLike<any>;
function validate(input: any): true | object | PromiseLike<any> {
  if (typeof input === 'string') {
    input = JSON.parse(input);
  } else if (input instanceof Project) {
    input = JSON.parse(JSON.stringify(input));
  } else if (typeof input !== 'object') {
    throw new Error('Unexpected parameter');
  }

  let isValid = validator(input);
  return isValid ? isValid : validator.errors;
}

export const serialization = {
  schema,
  validate
};
