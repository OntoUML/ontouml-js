import {
  Project,
  OntoumlType,
  OntoumlElement,
  ModelElement,
  Package,
  Class,
  Relation,
  Generalization,
  GeneralizationSet,
  Property,
  Literal,
  Diagram
} from '.';
import Ajv from 'ajv';
import { ClassView } from './view/class_view';
import { RelationView } from './view/relation_view';
import { GeneralizationView } from './view/generalization_view';
import { GeneralizationSetView } from './view/generalization_set_view';
import { PackageView } from './view/package_view';
import { Rectangle } from './view/rectangle';
import { Text } from './view/text';
import { Path } from './view/path';
import { RectangularShape } from './view/rectangular_shape';

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

function getElementMap(element: OntoumlElement): Map<string, OntoumlElement> {
  const map: Map<string, OntoumlElement> = new Map();
  map.set(element.id, element);
  element.getAllContents().forEach(element => map.set(element.id, element));

  return map;
}

function resolveReferences(contentsMap: Map<string, OntoumlElement>, contents: OntoumlElement[]) {
  for (const content of contents) {
    for (const [key, value] of Object.entries(content)) {
      if (isReferenceObject(value)) {
        const referencedElement = contentsMap.get(value.id);

        if (!referencedElement) {
          throw new Error('Object contains broken references');
        } else {
          content[key] = referencedElement;
        }
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // TODO: refactoring
          if (isReferenceObject(item)) {
            const referencedElement = contentsMap.get(item.id);

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
    case OntoumlType.DIAGRAM:
      return new Diagram(original);
    case OntoumlType.CLASS_VIEW:
      return new ClassView(original);
    case OntoumlType.RELATION_VIEW:
      return new RelationView(original);
    case OntoumlType.GENERALIZATION_VIEW:
      return new GeneralizationView(original);
    case OntoumlType.GENERALIZATION_SET_VIEW:
      return new GeneralizationSetView(original);
    case OntoumlType.PACKAGE_VIEW:
      return new PackageView(original);
    case OntoumlType.RECTANGLE:
      return new Rectangle(original);
    case OntoumlType.TEXT:
      return new Text(original);
    case OntoumlType.PATH:
      return new Path(original);
    default:
      throw new Error("No match for parameter's type");
  }
}

function revive(_key: any, value: any): any {
  let element: OntoumlElement;

  if (isOntoumlElement(value)) {
    if (value?.type === OntoumlType.TEXT || value?.type === OntoumlType.RECTANGLE) {
      value.topLeft = {
        x: value.x,
        y: value.y
      };
    }

    element = clone(value);
  }

  if (element instanceof Project || (!_key && element instanceof ModelElement)) {
    const project = element instanceof Project ? (element as Project) : null;
    const allContents: OntoumlElement[] = element.getAllContents();

    allContents.forEach((content: ModelElement) => {
      content.project = project;
      content.getContents().forEach((ownContent: ModelElement) => (ownContent.container = content));
    });

    const contentsMap = getElementMap(element as ModelElement);
    resolveReferences(contentsMap, [element, ...allContents]);
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
