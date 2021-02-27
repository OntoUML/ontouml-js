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
  Diagram,
  ClassView,
  RelationView,
  GeneralizationView,
  GeneralizationSetView,
  PackageView,
  Rectangle,
  Text,
  Path
} from '.';
import Ajv from 'ajv';

const schemas = {
  'https://ontouml.org/ontouml-schema/2021-02-26/Project': require('@resources/schemas/project.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Package': require('@resources/schemas/package.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Class': require('@resources/schemas/class.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Relation': require('@resources/schemas/relation.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Generalization': require('@resources/schemas/generalization.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSet': require('@resources/schemas/generalization_set.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Property': require('@resources/schemas/property.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Literal': require('@resources/schemas/literal.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/Diagram': require('@resources/schemas/diagram.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/ClassView': require('@resources/schemas/class_view.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/RelationView': require('@resources/schemas/relation_view.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationView': require('@resources/schemas/generalization_view.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSetView': require('@resources/schemas/generalization_set_view.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/PackageView': require('@resources/schemas/package_view.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/RectangleShape': require('@resources/schemas/rectangle_shape.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/TextShape': require('@resources/schemas/text_shape.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/PathShape': require('@resources/schemas/path_shape.schema.json'),
  'https://ontouml.org/ontouml-schema/2021-02-26/definitions': require('@resources/schemas/definitions.schema.json')
};

const typeToSchemaId = {
  [`${OntoumlType.PROJECT_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Project',
  [`${OntoumlType.PACKAGE_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Package',
  [`${OntoumlType.CLASS_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Class',
  [`${OntoumlType.RELATION_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Relation',
  [`${OntoumlType.GENERALIZATION_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Generalization',
  [`${OntoumlType.GENERALIZATION_SET_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSet',
  [`${OntoumlType.PROPERTY_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Property',
  [`${OntoumlType.LITERAL_TYPE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Literal',
  [`${OntoumlType.DIAGRAM}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/Diagram',
  [`${OntoumlType.CLASS_VIEW}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/ClassView',
  [`${OntoumlType.RELATION_VIEW}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/RelationView',
  [`${OntoumlType.GENERALIZATION_VIEW}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationView',
  [`${OntoumlType.GENERALIZATION_SET_VIEW}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSetView',
  [`${OntoumlType.PACKAGE_VIEW}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/PackageView',
  [`${OntoumlType.RECTANGLE}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/RectangleShape',
  [`${OntoumlType.TEXT}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/TextShape',
  [`${OntoumlType.PATH}`]: 'https://ontouml.org/ontouml-schema/2021-02-26/PathShape',
  definitions: 'https://ontouml.org/ontouml-schema/2021-02-26/definitions'
};

const ajv = new Ajv({
  schemas: Object.values(schemas)
});

function validate(element: OntoumlElement): true | object | PromiseLike<any>;
function validate(serializedProject: object): true | object | PromiseLike<any>;
function validate(serializedProject: string): true | object | PromiseLike<any>;
function validate(input: any): true | object | PromiseLike<any> {
  if (!input) {
    throw new Error('Unexpected parameter');
  }
  
  let schemaId = typeToSchemaId[OntoumlType.PROJECT_TYPE];

  if (typeof input === 'string') {
    input = JSON.parse(input);
  } else if (input instanceof OntoumlElement) {
    schemaId = typeToSchemaId[input.type];
    input = JSON.parse(JSON.stringify(input));
  } else if (typeof input !== 'object') {
    throw new Error('Unexpected parameter');
  }

  let validator = ajv.getSchema(schemaId);
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
    const result = validate(serializedElement);

    if (result !== true) {
      throw new Error('Invalid input');
    }
  }

  return JSON.parse(serializedElement, revive);
}

export const serializationUtils = {
  validate,
  revive,
  parse
};
