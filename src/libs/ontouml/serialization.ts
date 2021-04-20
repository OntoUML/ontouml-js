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

/** An object containing a map JSON Schema ids and their corresponding schemas. */
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

/** An object containing a map between `OntoumlType` values and the ids of their
 * corresponding JSON Schemas. */
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

/** Function that validates an `OntoumlElement` object against its corresponding
 * JSON Schema. */
function validate(element: OntoumlElement): true | object | PromiseLike<any>;

/** Function that validates an object against its corresponding JSON Schema
 * based on the value of its `type` field. */
function validate(serializedProject: object): true | object | PromiseLike<any>;

/** Function that validates a string representing a serialized `OntoumlElement`
 * object against its corresponding JSON Schema. */
function validate(serializedProject: string): true | object | PromiseLike<any>;

function validate(input: any): true | object | PromiseLike<any> {
  if (!input) {
    throw new Error('Unexpected parameter');
  }

  if (input instanceof OntoumlElement) {
    // a normal OntoumlElement will always fail the schemas due to additional properties
    input = JSON.stringify(input);
  }

  if (typeof input === 'string') {
    // the schemas only accept objects
    input = JSON.parse(input);
  }

  if (typeof input !== 'object') {
    // if the input is not an object at this point, the input was invalid
    throw new Error('Unexpected parameter');
  }

  // we'll always have a schema to check even in the absence of a valid `type` field
  const schemaId = typeToSchemaId[input.type] || typeToSchemaId[OntoumlType.PROJECT_TYPE];
  const validator = ajv.getSchema(schemaId);
  const isValid = validator(input);

  return isValid ? isValid : validator.errors;
}

function getElementMap(element: OntoumlElement): Map<string, OntoumlElement> {
  const map: Map<string, OntoumlElement> = new Map();
  map.set(element.id, element);
  element.getAllContents().forEach(element => map.set(element.id, element));

  return map;
}

/** Function that receives an object represent an `OntoumlElement` and returns
 * an instance of the corresponding class based on the value of its `type`
 * field. */
function clone(original: Partial<OntoumlElement>): OntoumlElement {
  switch (original.type) {
    case OntoumlType.PROJECT_TYPE:
      return new Project(original);
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
      return new Property(original);
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

/** Parsing function to be passed as argument to `JSON.stringify` to support the
 * de-serialization of `OntoumlElement` objects. */
function revive(_key: any, value: any): any {
  let element: OntoumlElement;

  /* It is not possible to distinguish a reference from an object with
   * missing fields, so let's clone everything that has type and id and later
   * resolve the references where only objects returned in getContents() are not
   * references. */
  if (value?.type && value?.id) {
    if (value?.type === OntoumlType.TEXT || value?.type === OntoumlType.RECTANGLE) {
      value.topLeft = {
        x: value.x,
        y: value.y
      };
    }

    element = clone(value);
  }

  if (element instanceof Project || (!_key && element instanceof OntoumlElement)) {
    const project = element instanceof Project ? (element as Project) : null;
    const allContents: OntoumlElement[] = element.getAllContents();

    // Set references to container and project
    allContents.forEach((content: ModelElement) => {
      content.project = project;
      content.getContents().forEach((ownContent: ModelElement) => (ownContent.container = content));
    });

    const contentsMap = getElementMap(element as ModelElement);
    const allElements = [element, ...allContents];

    // Resolves reference fields replacing objects that are created to
    // temporarily hold a type and an id
    allElements.forEach((content: ModelElement) => content.resolveReferences(contentsMap));
  }

  return element ? element : value;
}

/** Parse function that receives a `OntoumlElement` serialized into a string and
 * returns an object instance of `OntoumlElement`. The function also tries to
 * resolve references to other elements if present and an exception is thrown
 * in case of failure.
 *
 * @param serializedElement - the string to be parsed
 * @param validateElement - an optional boolean identifying whether the
 * `serializedElement` should be validate against the corresponding JSON Schema.
 * Default `false`.  */
function parse(serializedElement: string, validateElement: boolean = false): OntoumlElement {
  if (validateElement) {
    const result = validate(serializedElement);

    if (result !== true) {
      throw new Error('Invalid input');
    }
  }

  // TODO: check reference type on parse
  return JSON.parse(serializedElement, revive);
}

/** A utility module designed to support the de-serialization and validation of
 * `OntoumlElement` objects. */
export const serializationUtils = {
  validate,
  revive,
  parse,
  schemas,
  typeToSchemaId
};
