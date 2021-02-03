import {
  Project,
  OntoumlType,
  Container,
  OntoumlElement,
  ModelElement,
  Package,
  Class,
  Relation,
  Generalization,
  GeneralizationSet,
  Property,
  Literal
} from './';
import Ajv from 'ajv';

const schemaJson = require('./../../../resources/schema.json');
Object.freeze(schemaJson);

export const schema = schemaJson;

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

function isOntoumlElement(value: any): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof value.type === 'string' && typeof value.id === 'string' && Object.keys(value).length > 2;
}

function isReferenceObject(value: any): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return typeof value.type === 'string' && typeof value.id === 'string' && Object.keys(value).length === 2;
}

function getContentsMap(element: ModelElement) {
  const contentsMap: { [id: string]: OntoumlElement } = { [element.id]: element };

  if (element.isContainer()) {
    ((element as unknown) as Container<any, any>)
      .getAllContents()
      .forEach((content: ModelElement) => (contentsMap[content.id] = content));
  }

  return contentsMap;
}

function resolveReferences(contentsMap: { [id: string]: OntoumlElement }, contents: OntoumlElement[]) {
  for (const content of contents) {
    for (const [key, value] of Object.entries(content)) {
      if (isReferenceObject(value)) {
        const referencedElement = contentsMap[value.id];

        if (!referencedElement) {
          throw new Error('Object contains broken references');
        } else {
          content[key] = referencedElement;
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // TODO: refactoring
          if (isReferenceObject(item)) {
            const referencedElement = contentsMap[item.id];

            if (!referencedElement) {
              throw new Error('Object contains broken references');
            } else {
              value[index] = referencedElement;
            }
          }
        });
      }
    }
  }
}

function clone(original: Partial<OntoumlElement>): OntoumlElement {
  switch (original.type) {
    case OntoumlType.PROJECT_TYPE:
      return new Project(original as any);
    case OntoumlType.PACKAGE_TYPE:
      return new Package(original);
    case OntoumlType.CLASS_TYPE:
      return new Class(original);
    case OntoumlType.RELATION_TYPE:
      return new Relation(original);
    case OntoumlType.GENERALIZATION_TYPE:
      return new Generalization(original);
    case OntoumlType.GENERALIZATION_SET_TYPE:
      return new GeneralizationSet(original);
    case OntoumlType.PROPERTY_TYPE:
      return new Property(original as any);
    case OntoumlType.LITERAL_TYPE:
      return new Literal(original);
    default:
      throw new Error("No match for parameter's type");
  }
}

function revive(_key: any, value: any): any {
  let element: OntoumlElement;

  if (isOntoumlElement(value)) {
    element = clone(value);
  }

  if (element instanceof Project || (!_key && element instanceof ModelElement)) {
    if (element.isContainer()) {
      const project = element instanceof Project ? (element as Project) : null;
      const allContents: OntoumlElement[] = (element as any).getAllContents();
      const contentsMap = getContentsMap(element as ModelElement);

      allContents.forEach((content: ModelElement) => {
        content.project = project;

        if (content.isContainer()) {
          (content as any).getContents().forEach((ownContent: ModelElement) => (ownContent.container = content));
        }
      });

      resolveReferences(contentsMap, [element, ...allContents]);
    } else {
      const contentsMap = getContentsMap(element as ModelElement);
      resolveReferences(contentsMap, [element]);
    }
  }

  return element ? element : value;
}

function parse(serializedElement: string, validateProject: boolean = false): OntoumlElement {
  if (validateProject) {
    const isValid = validate(JSON.parse(serializedElement));

    if (!isValid) {
      throw new Error('Invalid input');
    }
  }

  return JSON.parse(serializedElement, revive);
}

export const serializationUtils = {
  schema,
  validate,
  revive,
  parse
};
