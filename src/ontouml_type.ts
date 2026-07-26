/**
 * The discriminator values used in the `type` field of serialized elements,
 * as defined by the OntoUML JSON Schema (https://w3id.org/ontouml/schema).
 * Each value identifies the concrete type of an {@link OntoumlElement} in a
 * serialized project, covering model elements (e.g., `Class`,
 * `Generalization`), diagrams, views, and shapes.
 */
export enum OntoumlType {
  PROJECT = 'Project',
  PACKAGE = 'Package',
  CLASS = 'Class',
  BINARY_RELATION = 'BinaryRelation',
  NARY_RELATION = 'NaryRelation',
  GENERALIZATION = 'Generalization',
  GENERALIZATION_SET = 'GeneralizationSet',
  PROPERTY = 'Property',
  LITERAL = 'Literal',
  NOTE = 'Note',
  ANCHOR = 'Anchor',
  DIAGRAM = 'Diagram',
  CLASS_VIEW = 'ClassView',
  BINARY_RELATION_VIEW = 'BinaryRelationView',
  NARY_RELATION_VIEW = 'NaryRelationView',
  GENERALIZATION_VIEW = 'GeneralizationView',
  GENERALIZATION_SET_VIEW = 'GeneralizationSetView',
  PACKAGE_VIEW = 'PackageView',
  NOTE_VIEW = 'NoteView',
  ANCHOR_VIEW = 'AnchorView',
  RECTANGLE = 'Rectangle',
  DIAMOND = 'Diamond',
  TEXT = 'Text',
  PATH = 'Path'
}
