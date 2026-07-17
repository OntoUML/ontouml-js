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
  Resource,
  Cardinality,
  Nature,
  AggregationKind,
  parseOrder,
  Diagram,
  View,
  ClassView,
  PackageView,
  NoteView,
  BinaryRelationView,
  GeneralizationView,
  NaryRelationView,
  GeneralizationSetView,
  AnchorView
} from '.';

/** The discriminator values of shapes, which are contained by views and are
 * not accepted as top-level project elements. */
const SHAPE_TYPES: string[] = [
  OntoumlType.RECTANGLE,
  OntoumlType.DIAMOND,
  OntoumlType.TEXT,
  OntoumlType.PATH
];

/**
 * Deserializes an object mapping language tags to text values into a
 * {@link MultilingualText}.
 */
function textFromJSON(raw: any): MultilingualText {
  const text = new MultilingualText();

  if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([language, value]) =>
      text.add(value as string, language)
    );
  }

  return text;
}

/**
 * Deserializes an object with `URI` and `name` fields into a
 * {@link Resource}.
 */
function resourceFromJSON(raw: any): Resource {
  const resource = new Resource(raw?.URI ?? undefined);
  resource.name = textFromJSON(raw?.name);
  return resource;
}

/**
 * Copies the fields defined by {@link OntoumlElement} (id and timestamps)
 * from a raw serialized object into an element.
 */
function setOntoumlElementFields(element: OntoumlElement, raw: any): void {
  element.id = raw.id;

  if (raw.created) {
    element.created = new Date(raw.created);
  }

  element.modified = raw.modified ? new Date(raw.modified) : undefined;
}

/**
 * Copies the fields defined by {@link NamedElement} (name, description, and
 * authorship metadata) from a raw serialized object into an element.
 */
function setNamedElementFields(element: NamedElement, raw: any): void {
  setOntoumlElementFields(element, raw);

  element.name = textFromJSON(raw.name);
  element.description = textFromJSON(raw.description);
  element.alternativeNames = (raw.alternativeNames ?? []).map(textFromJSON);
  element.editorialNotes = (raw.editorialNotes ?? []).map(textFromJSON);
  element.creators = (raw.creators ?? []).map(resourceFromJSON);
  element.contributors = (raw.contributors ?? []).map(resourceFromJSON);
}

/**
 * Copies the fields defined by {@link ModelElement} (custom properties, in
 * addition to the named element fields) from a raw serialized object into an
 * element.
 */
function setModelElementFields(element: ModelElement, raw: any): void {
  setNamedElementFields(element, raw);
  element.customProperties = raw.customProperties ?? {};
}

/**
 * Copies the fields defined by {@link Decoratable} (stereotype and
 * derivation flag) from a raw serialized object into an element.
 */
function setDecoratableFields(element: Decoratable<any>, raw: any): void {
  setModelElementFields(element, raw);
  element.stereotype = raw.stereotype ?? undefined;
  element.isDerived = raw.isDerived ?? false;
}

/**
 * Copies the fields defined by {@link Property} (cardinality, aggregation
 * kind, ordering and read-only flags, and property type) from a raw
 * serialized object into a property, resolving the property type against the
 * elements deserialized so far.
 */
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

/**
 * Returns the deserialized element registered under `referenceId`.
 *
 * @param ownerId - id of the element holding the reference; used to compose
 *        the error message.
 * @param field - name of the field holding the reference; used to compose
 *        the error message.
 * @throws an error accusing a broken reference if no element with a matching
 *         id has been registered.
 */
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

/**
 * Parses a {@link Project} serialized into a string, as defined by the
 * OntoUML JSON Schema (https://w3id.org/ontouml/schema), and returns the
 * corresponding instance of {@link Project}.
 *
 * Model elements, diagrams, and views are fully supported. Shapes are not
 * part of the project serialization (the schema defines no container for
 * them), so the shapes of parsed views keep their serialized identifiers but
 * are recreated with default dimensions and positions.
 *
 * @param serializedProject - the JSON string to parse.
 * @throws an error if the string is not a serialized {@link Project} or if
 *         references between elements cannot be resolved.
 */
function parse(serializedProject: string): Project {
  const raw = JSON.parse(serializedProject);

  if (raw?.type !== OntoumlType.PROJECT) {
    throw new Error(
      `Cannot parse element of type '${raw?.type}'. Only serialized projects are supported.`
    );
  }

  const project = new Project();
  setNamedElementFields(project, raw);

  project.license = raw.license ? resourceFromJSON(raw.license) : undefined;
  project.namespace = raw.namespace ?? undefined;
  project.publisher = raw.publisher
    ? resourceFromJSON(raw.publisher)
    : undefined;
  project.representationStyle = raw.representationStyle
    ? resourceFromJSON(raw.representationStyle)
    : undefined;
  project.accessRights = (raw.accessRights ?? []).map(resourceFromJSON);
  project.acronyms = raw.acronyms ?? [];
  project.bibliographicCitations = (raw.bibliographicCitations ?? []).map(
    textFromJSON
  );
  project.contexts = (raw.contexts ?? []).map(resourceFromJSON);
  project.designedForTasks = (raw.designedForTasks ?? []).map(resourceFromJSON);
  project.keywords = (raw.keywords ?? []).map(textFromJSON);
  project.landingPages = raw.landingPages ?? [];
  project.languages = raw.languages ?? [];
  project.ontologyTypes = (raw.ontologyTypes ?? []).map(resourceFromJSON);
  project.sources = raw.sources ?? [];
  project.themes = (raw.themes ?? []).map(resourceFromJSON);

  const rawElements: any[] = raw.elements ?? [];

  const unsupported = rawElements.find(e => SHAPE_TYPES.includes(e?.type));
  if (unsupported) {
    throw new Error(
      `Cannot parse element of type '${unsupported.type}'. Shapes are contained by views and are not supported as project elements.`
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

  // Node views, which represent a single model element in a diagram
  for (const rawView of rawOfType(OntoumlType.CLASS_VIEW)) {
    const view = new ClassView(
      getResolved<Class>(elements, rawView.isViewOf, rawView.id, 'isViewOf')
    );
    setOntoumlElementFields(view, rawView);
    if (rawView.rectangle) view.rectangle.id = rawView.rectangle;
    register(view);
  }

  for (const rawView of rawOfType(OntoumlType.PACKAGE_VIEW)) {
    const view = new PackageView(
      getResolved<Package>(elements, rawView.isViewOf, rawView.id, 'isViewOf')
    );
    setOntoumlElementFields(view, rawView);
    if (rawView.rectangle) view.rectangle.id = rawView.rectangle;
    register(view);
  }

  for (const rawView of rawOfType(OntoumlType.NOTE_VIEW)) {
    const view = new NoteView(
      getResolved<Note>(elements, rawView.isViewOf, rawView.id, 'isViewOf')
    );
    setOntoumlElementFields(view, rawView);
    if (rawView.text) view.text.id = rawView.text;
    register(view);
  }

  // Connector views, whose endpoints may reference other connector views
  // (e.g., in derivations), are created once their endpoints are available
  const pendingConnectorViews = [
    ...rawOfType(OntoumlType.BINARY_RELATION_VIEW),
    ...rawOfType(OntoumlType.GENERALIZATION_VIEW),
    ...rawOfType(OntoumlType.NARY_RELATION_VIEW),
    ...rawOfType(OntoumlType.ANCHOR_VIEW)
  ];

  while (pendingConnectorViews.length > 0) {
    const position = pendingConnectorViews.findIndex(rawView => {
      const endpoints =
        rawView.type === OntoumlType.NARY_RELATION_VIEW
          ? rawView.members ?? []
          : [rawView.sourceView, rawView.targetView];

      return endpoints.every(
        (viewId: string) => !viewId || elements.has(viewId)
      );
    });

    if (position < 0) {
      throw new Error(
        `Could not resolve the endpoints of the views '${pendingConnectorViews
          .map(v => v.id)
          .join("', '")}'.`
      );
    }

    const rawView = pendingConnectorViews.splice(position, 1)[0];

    if (rawView.type === OntoumlType.BINARY_RELATION_VIEW) {
      const view = new BinaryRelationView(
        getResolved<BinaryRelation>(
          elements,
          rawView.isViewOf,
          rawView.id,
          'isViewOf'
        ),
        getResolved<View<any>>(
          elements,
          rawView.sourceView,
          rawView.id,
          'sourceView'
        ),
        getResolved<View<any>>(
          elements,
          rawView.targetView,
          rawView.id,
          'targetView'
        )
      );
      setOntoumlElementFields(view, rawView);
      if (rawView.path) view.path.id = rawView.path;
      register(view);
    } else if (rawView.type === OntoumlType.GENERALIZATION_VIEW) {
      const view = new GeneralizationView(
        getResolved<Generalization>(
          elements,
          rawView.isViewOf,
          rawView.id,
          'isViewOf'
        ),
        getResolved<View<any>>(
          elements,
          rawView.sourceView,
          rawView.id,
          'sourceView'
        ),
        getResolved<View<any>>(
          elements,
          rawView.targetView,
          rawView.id,
          'targetView'
        )
      );
      setOntoumlElementFields(view, rawView);
      if (rawView.path) view.path.id = rawView.path;
      register(view);
    } else if (rawView.type === OntoumlType.NARY_RELATION_VIEW) {
      const members = (rawView.members ?? []).map((memberId: string) =>
        getResolved<ClassView>(elements, memberId, rawView.id, 'members')
      );
      const view = new NaryRelationView(
        getResolved<NaryRelation>(
          elements,
          rawView.isViewOf,
          rawView.id,
          'isViewOf'
        ),
        members
      );
      setOntoumlElementFields(view, rawView);
      if (rawView.diamond) view.diamond.id = rawView.diamond;
      const paths = view.paths;
      (rawView.paths ?? []).forEach((pathId: string, index: number) => {
        if (paths[index]) paths[index].id = pathId;
      });
      register(view);
    } else {
      const view = new AnchorView(
        getResolved<Anchor>(elements, rawView.isViewOf, rawView.id, 'isViewOf'),
        getResolved<NoteView>(
          elements,
          rawView.sourceView,
          rawView.id,
          'sourceView'
        ),
        getResolved<View<any>>(
          elements,
          rawView.targetView,
          rawView.id,
          'targetView'
        )
      );
      setOntoumlElementFields(view, rawView);
      if (rawView.path) view.path.id = rawView.path;
      register(view);
    }
  }

  // Generalization set views, which reference generalization views
  for (const rawView of rawOfType(OntoumlType.GENERALIZATION_SET_VIEW)) {
    const view = new GeneralizationSetView(
      getResolved<GeneralizationSet>(
        elements,
        rawView.isViewOf,
        rawView.id,
        'isViewOf'
      )
    );
    setOntoumlElementFields(view, rawView);
    if (rawView.text) view.text.id = rawView.text;
    view.generalizations = (rawView.generalizations ?? []).map(
      (viewId: string) =>
        getResolved<GeneralizationView>(
          elements,
          viewId,
          rawView.id,
          'generalizations'
        )
    );
    register(view);
  }

  // Diagrams
  for (const rawDiagram of rawOfType(OntoumlType.DIAGRAM)) {
    const diagram = new Diagram(project);
    setOntoumlElementFields(diagram, rawDiagram);

    if (rawDiagram.owner) {
      diagram.owner = getResolved<ModelElement>(
        elements,
        rawDiagram.owner,
        rawDiagram.id,
        'owner'
      );
    }

    // The views setter is used on purpose: unlike addView(), it does not
    // register the views in the project, which is done in order at the end
    diagram.views = (rawDiagram.views ?? []).map((viewId: string) =>
      getResolved<View<any>>(elements, viewId, rawDiagram.id, 'views')
    );

    register(diagram);
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

/**
 * A utility module supporting the deserialization of {@link OntoumlElement}
 * objects serialized according to the OntoUML JSON Schema
 * (https://w3id.org/ontouml/schema).
 *
 * @example
 * ```typescript
 * const project = serializationUtils.parse(json);
 * ```
 */
export const serializationUtils = {
  parse
};
