import {
  Project,
  Package,
  PackageableElement,
  Class,
  BinaryRelation,
  NaryRelation,
  Relation,
  Generalization,
  GeneralizationSet,
  Property,
  Literal,
  Note,
  Anchor,
  OntoumlType,
  OntoumlElement,
  NamedElement,
  ModelElement,
  Decoratable,
  Classifier,
  MultilingualText,
  Cardinality,
  Nature,
  ClassStereotype,
  AggregationKind,
  parseOrder
} from '.';

const DIAGRAM_TYPES: string[] = [
  OntoumlType.DIAGRAM,
  OntoumlType.CLASS_VIEW,
  OntoumlType.BINARY_RELATION_VIEW,
  OntoumlType.NARY_RELATION_VIEW,
  OntoumlType.GENERALIZATION_VIEW,
  OntoumlType.GENERALIZATION_SET_VIEW,
  OntoumlType.PACKAGE_VIEW,
  OntoumlType.NOTE_VIEW,
  OntoumlType.ANCHOR_VIEW,
  OntoumlType.RECTANGLE,
  OntoumlType.DIAMOND,
  OntoumlType.TEXT,
  OntoumlType.PATH
];

function textFromJSON(raw: any): MultilingualText {
  const text = new MultilingualText();

  if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([language, value]) =>
      text.add(value as string, language)
    );
  }

  return text;
}

function setOntoumlElementFields(element: OntoumlElement, raw: any): void {
  element.id = raw.id;

  if (raw.created) {
    element.created = new Date(raw.created);
  }

  element.modified = raw.modified ? new Date(raw.modified) : undefined;
}

function setNamedElementFields(element: NamedElement, raw: any): void {
  setOntoumlElementFields(element, raw);

  element.name = textFromJSON(raw.name);
  element.description = textFromJSON(raw.description);
  element.alternativeNames = (raw.alternativeNames ?? []).map(textFromJSON);
  element.editorialNotes = (raw.editorialNotes ?? []).map(textFromJSON);
  element.creators = raw.creators ?? [];
  element.contributors = raw.contributors ?? [];
}

function setModelElementFields(element: ModelElement, raw: any): void {
  setNamedElementFields(element, raw);
  element.customProperties = raw.customProperties ?? {};
}

function setDecoratableFields(element: Decoratable<any>, raw: any): void {
  setModelElementFields(element, raw);
  element.stereotype = raw.stereotype ?? undefined;
  element.isDerived = raw.isDerived ?? false;
}

function setPropertyFields(
  property: Property,
  raw: any,
  elements: Map<string, OntoumlElement>
): void {
  setDecoratableFields(property, raw);

  property.cardinality = new Cardinality(raw.cardinality ?? null);
  property.aggregationKind = raw.aggregationKind ?? AggregationKind.NONE;
  property.isOrdered = raw.isOrdered ?? false;
  property.isReadOnly = raw.isReadOnly ?? false;

  if (raw.propertyType) {
    property.propertyType = getResolved<Classifier<any, any>>(
      elements,
      raw.propertyType,
      raw.id,
      'propertyType'
    );
  }
}

function getResolved<T extends OntoumlElement>(
  elements: Map<string, OntoumlElement>,
  referenceId: string,
  ownerId: string,
  field: string
): T {
  const element = elements.get(referenceId);

  if (!element) {
    throw new Error(
      `Could not resolve broken reference '${field}: ${referenceId}' in element '${ownerId}'.`
    );
  }

  return element as T;
}

/** Parse function that receives a `Project` serialized into a string, as
 * defined by the OntoUML JSON Schema (https://w3id.org/ontouml/schema), and
 * returns the corresponding instance of `Project`.
 *
 * The current implementation supports the abstract syntax of the language
 * (i.e., model elements). Support for the deserialization of the concrete
 * syntax (i.e., diagrams, views, and shapes) is still to be implemented.
 *
 * @throws an error if the string is not a serialized `Project`, if references
 * between elements cannot be resolved, or if the serialization contains
 * diagrams. */
function parse(serializedProject: string): Project {
  const raw = JSON.parse(serializedProject);

  if (raw?.type !== OntoumlType.PROJECT) {
    throw new Error(
      `Cannot parse element of type '${raw?.type}'. Only serialized projects are supported.`
    );
  }

  const project = new Project();
  setNamedElementFields(project, raw);

  project.license = raw.license ?? undefined;
  project.namespace = raw.namespace ?? undefined;
  project.publisher = raw.publisher ?? undefined;
  project.representationStyle = raw.representationStyle ?? undefined;
  project.accessRights = raw.accessRights ?? [];
  project.acronyms = raw.acronyms ?? [];
  project.bibliographicCitations = raw.bibliographicCitations ?? [];
  project.contexts = raw.contexts ?? [];
  project.designedForTasks = raw.designedForTasks ?? [];
  project.keywords = raw.keywords ?? [];
  project.landingPages = raw.landingPages ?? [];
  project.languages = raw.languages ?? [];
  project.ontologyTypes = raw.ontologyTypes ?? [];
  project.sources = raw.sources ?? [];
  project.themes = raw.themes ?? [];

  const rawElements: any[] = raw.elements ?? [];

  const unsupported = rawElements.find(e => DIAGRAM_TYPES.includes(e?.type));
  if (unsupported) {
    throw new Error(
      `Cannot parse element of type '${unsupported.type}'. The deserialization of diagrams, views, and shapes is not yet supported.`
    );
  }

  const rawById: Map<string, any> = new Map(rawElements.map(e => [e.id, e]));
  const elements: Map<string, OntoumlElement> = new Map();

  const rawOfType = (type: OntoumlType) =>
    rawElements.filter(e => e?.type === type);

  const register = (element: OntoumlElement) => {
    elements.set(element.id, element);
  };

  // Packages
  for (const rawPackage of rawOfType(OntoumlType.PACKAGE)) {
    const pkg = new Package(project);
    setModelElementFields(pkg, rawPackage);
    register(pkg);
  }

  // Classes
  for (const rawClass of rawOfType(OntoumlType.CLASS)) {
    const clazz = new Class(project);
    setDecoratableFields(clazz, rawClass);

    clazz.isAbstract = rawClass.isAbstract ?? false;
    clazz.restrictedTo = (rawClass.restrictedTo ?? []) as Nature[];
    clazz.isPowertype = rawClass.isPowertype ?? false;
    clazz.order =
      typeof rawClass.order === 'string'
        ? parseOrder(rawClass.order)
        : rawClass.order ?? 1;

    register(clazz);
  }

  // Literals, contained by their enumeration classes
  for (const rawClass of rawOfType(OntoumlType.CLASS)) {
    const clazz = elements.get(rawClass.id) as Class;

    for (const literalId of rawClass.literals ?? []) {
      const rawLiteral = rawById.get(literalId);

      if (!rawLiteral) {
        throw new Error(
          `Could not resolve broken reference 'literals: ${literalId}' in element '${rawClass.id}'.`
        );
      }

      const literal = new Literal(clazz);
      setModelElementFields(literal, rawLiteral);
      register(literal);
    }
  }

  // Relations, whose ends may reference other relations (e.g., in
  // derivations), are created once all of their members are available
  const pendingRelations = [
    ...rawOfType(OntoumlType.BINARY_RELATION),
    ...rawOfType(OntoumlType.NARY_RELATION)
  ];

  while (pendingRelations.length > 0) {
    const position = pendingRelations.findIndex(rawRelation =>
      (rawRelation.properties ?? [])
        .map((endId: string) => rawById.get(endId)?.propertyType)
        .every((typeId: string) => !typeId || elements.has(typeId))
    );

    if (position < 0) {
      throw new Error(
        `Could not resolve the members of the relations '${pendingRelations
          .map(r => r.id)
          .join("', '")}'.`
      );
    }

    const rawRelation = pendingRelations.splice(position, 1)[0];
    const rawEnds = (rawRelation.properties ?? []).map((endId: string) => {
      const rawEnd = rawById.get(endId);

      if (!rawEnd) {
        throw new Error(
          `Could not resolve broken reference 'properties: ${endId}' in element '${rawRelation.id}'.`
        );
      }

      return rawEnd;
    });
    const members = rawEnds.map(
      (rawEnd: any) =>
        (rawEnd?.propertyType
          ? elements.get(rawEnd.propertyType)
          : undefined) as Classifier<any, any>
    );

    const relation: Relation =
      rawRelation.type === OntoumlType.BINARY_RELATION
        ? new BinaryRelation(project, members[0], members[1])
        : new NaryRelation(project, members);

    setDecoratableFields(relation, rawRelation);
    relation.isAbstract = rawRelation.isAbstract ?? false;

    relation.properties.forEach((end, index) => {
      setPropertyFields(end, rawEnds[index], elements);
      register(end);
    });

    register(relation);
  }

  // Attributes, contained by their classes
  for (const rawClass of rawOfType(OntoumlType.CLASS)) {
    const clazz = elements.get(rawClass.id) as Class;

    for (const propertyId of rawClass.properties ?? []) {
      const rawProperty = rawById.get(propertyId);

      if (!rawProperty) {
        throw new Error(
          `Could not resolve broken reference 'properties: ${propertyId}' in element '${rawClass.id}'.`
        );
      }

      const attribute = new Property(project);
      setPropertyFields(attribute, rawProperty, elements);
      clazz.addAttribute(attribute);
      register(attribute);
    }
  }

  // Generalizations
  for (const rawGeneralization of rawOfType(OntoumlType.GENERALIZATION)) {
    const general = getResolved<Classifier<any, any>>(
      elements,
      rawGeneralization.general,
      rawGeneralization.id,
      'general'
    );
    const specific = getResolved<Classifier<any, any>>(
      elements,
      rawGeneralization.specific,
      rawGeneralization.id,
      'specific'
    );

    const generalization = new Generalization(project, general, specific);
    setModelElementFields(generalization, rawGeneralization);
    register(generalization);
  }

  // Generalization sets
  for (const rawGenSet of rawOfType(OntoumlType.GENERALIZATION_SET)) {
    const genSet = new GeneralizationSet(project);
    setModelElementFields(genSet, rawGenSet);

    genSet.isDisjoint = rawGenSet.isDisjoint ?? false;
    genSet.isComplete = rawGenSet.isComplete ?? false;

    if (rawGenSet.categorizer) {
      genSet.categorizer = getResolved<Class>(
        elements,
        rawGenSet.categorizer,
        rawGenSet.id,
        'categorizer'
      );
    }

    for (const generalizationId of rawGenSet.generalizations ?? []) {
      genSet.addGeneralization(
        getResolved<Generalization>(
          elements,
          generalizationId,
          rawGenSet.id,
          'generalizations'
        )
      );
    }

    register(genSet);
  }

  // Notes
  for (const rawNote of rawOfType(OntoumlType.NOTE)) {
    const note = new Note(project);
    setModelElementFields(note, rawNote);
    note.text = textFromJSON(rawNote.text);
    register(note);
  }

  // Anchors
  for (const rawAnchor of rawOfType(OntoumlType.ANCHOR)) {
    const note = getResolved<Note>(
      elements,
      rawAnchor.note,
      rawAnchor.id,
      'note'
    );
    const element = getResolved<ModelElement>(
      elements,
      rawAnchor.element,
      rawAnchor.id,
      'element'
    );

    const anchor = new Anchor(project, note, element);
    setModelElementFields(anchor, rawAnchor);
    register(anchor);
  }

  // Subsetted and redefined properties, which may reference any property
  for (const rawProperty of rawOfType(OntoumlType.PROPERTY)) {
    const property = elements.get(rawProperty.id) as Property;

    if (!property) {
      continue;
    }

    for (const subsettedId of rawProperty.subsettedProperties ?? []) {
      property.addSubsettedProperty(
        getResolved<Property>(
          elements,
          subsettedId,
          rawProperty.id,
          'subsettedProperties'
        )
      );
    }

    for (const redefinedId of rawProperty.redefinedProperties ?? []) {
      property.addRedefinedProperty(
        getResolved<Property>(
          elements,
          redefinedId,
          rawProperty.id,
          'redefinedProperties'
        )
      );
    }
  }

  // Package contents
  for (const rawPackage of rawOfType(OntoumlType.PACKAGE)) {
    const pkg = elements.get(rawPackage.id) as Package;

    for (const contentId of rawPackage.contents ?? []) {
      pkg.addContent(
        getResolved<OntoumlElement>(
          elements,
          contentId,
          rawPackage.id,
          'contents'
        ) as PackageableElement
      );
    }
  }

  // Root package
  if (raw.root) {
    project.root = getResolved<Package>(elements, raw.root, raw.id, 'root');
  }

  // Registers the elements in the project preserving the order of the
  // original serialization. Elements that were never instantiated at this
  // point (e.g., properties and literals not contained by any classifier)
  // denote a corrupted serialization.
  for (const rawElement of rawElements) {
    const element = elements.get(rawElement.id);

    if (!element) {
      throw new Error(
        `Could not resolve the container of element '${rawElement.id}'.`
      );
    }

    project.add(element);
  }

  return project;
}

/** A utility module designed to support the de-serialization of
 * `OntoumlElement` objects. */
export const serializationUtils = {
  parse
};
