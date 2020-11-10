import schema from './schema.json';
import { Project } from './';
import Ajv from 'ajv';

Object.freeze(schema);

const ajv = new Ajv();
const validator = ajv.compile(schema);

function validate(project: Project): true | object | PromiseLike<any>;
function validate(serializedProject: object): true | object | PromiseLike<any>;
function validate(project: any): true | object | PromiseLike<any> {
  const deepCopy = JSON.parse(JSON.stringify(project));
  let isValid = validator(deepCopy);
  return isValid ? isValid : validator.errors;
}

export const serialization = {
  schema,
  validate
};
