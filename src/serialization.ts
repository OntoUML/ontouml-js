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
  else {
    return value;
  }

  if (element instanceof Project || (!_key && element instanceof OntoumlElement)) {
    
    const allContents: OntoumlElement[] = element.getAllContents();

    // Set references to container and project
    allContents.forEach( content => {
      if(element instanceof Project)
        content.project = element as Project;
      
      content.getContents()
             .forEach( ownContent => (ownContent.container = content) );
    });

    const contentsMap = getElementMap(element as ModelElement);
    const allElements = [element, ...allContents];

    // Resolves reference fields replacing objects that are created to
    // temporarily hold a type and an id
    allElements.forEach(content => content.resolveReferences(contentsMap));
  }

  return element;
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
function parse(serializedElement: string): OntoumlElement {
  
  // TODO: check reference type on parse
  return JSON.parse(serializedElement, revive);
}

/** A utility module designed to support the de-serialization and validation of
 * `OntoumlElement` objects. */
export const serializationUtils = {
  revive,
  parse
};
