/**
 * Controlled vocabularies for project metadata fields, as defined by the
 * OntoUML/UFO Catalog Metadata Vocabulary
 * ({@link https://w3id.org/ontouml-models/vocabulary}).
 *
 * The values of these enums are the URIs of the individuals defined in the
 * vocabulary. They can be passed to the metadata methods of
 * {@link ProjectBuilder} (e.g., `context`, `designedForTask`, `ontologyType`,
 * and `representationStyle`), which resolve them to {@link Resource} instances
 * bearing their official labels.
 */

const prefix = 'https://w3id.org/ontouml-models/vocabulary#';

/**
 * The contexts in which an ontology can be developed, i.e., the types of
 * initiatives that motivated its creation.
 */
export enum OntologyDevelopmentContext {
  /**
   * Determines that the artifact was developed within the context of a course
   * on conceptual modeling, most likely as a course assignment.
   */
  CLASSROOM = prefix + 'Classroom',

  /**
   * Determines that the artifact was developed for a public or private
   * organization.
   */
  INDUSTRY = prefix + 'Industry',

  /**
   * Determines that the artifact was developed as part of a research project.
   * This usually implies that the artifact was featured in a scientific
   * publication.
   */
  RESEARCH = prefix + 'Research'
}

/**
 * The modeling styles an ontology can adopt, based on the languages used to
 * express its elements.
 */
export enum OntologyRepresentationStyle {
  /**
   * Characterizes a model that contains at least one class, relation, or
   * property using a valid OntoUML stereotype.
   */
  ONTOUML = prefix + 'OntoumlStyle',

  /**
   * Characterizes a model that contains at least one class or relation from
   * UFO without an OntoUML stereotype.
   */
  UFO = prefix + 'UfoStyle'
}

/**
 * The types of ontologies according to their generality, as proposed in
 * Roussey et al. (2011), "An introduction to ontologies and ontology
 * engineering."
 */
export enum OntologyType {
  /**
   * Identifies an ontology that grasps the central concepts and relations of
   * a given domain, possibly integrating several domain ontologies and being
   * applicable in multiple scenarios. E.g., UFO-S, a commitment-based
   * ontology of services, applies to services in multiple domains, such as
   * medical, financial, and legal services.
   */
  CORE = prefix + 'Core',

  /**
   * Identifies an ontology that describes how a community conceptualizes a
   * phenomenon of interest. In general, a domain ontology formally
   * characterizes a much narrower domain than a core ontology does.
   */
  DOMAIN = prefix + 'Domain',

  /**
   * Identifies an ontology that specializes a domain ontology where there
   * could be no consensus or knowledge sharing. It represents the particular
   * model of a domain according to a single viewpoint of a user or a
   * developer.
   */
  APPLICATION = prefix + 'Application'
}

/**
 * The goals that motivate the development of an ontology.
 */
export enum OntologyPurpose {
  /**
   * Determines that the artifact was created as the result of an ontological
   * analysis of a concept, language, or domain of interest that sought to
   * conceptually clarify and untangle complex notions and relations.
   */
  CONCEPTUAL_CLARIFICATION = prefix + 'ConceptualClarification',

  /**
   * Determines that the artifact was created to support the publication of
   * some datasets. For instance, a conceptual model used to generate an OWL
   * vocabulary to publish tabular data as linked open data on the web.
   */
  DATA_PUBLICATION = prefix + 'DataPublication',

  /**
   * Determines that the artifact was created during the development of a
   * decision support system.
   */
  DECISION_SUPPORT_SYSTEM = prefix + 'DecisionSupportSystem',

  /**
   * Determines that the artifact was created to demonstrate how OntoUML can
   * be used to solve a certain modeling challenge, to support an experiment
   * involving OntoUML, or to exemplify how a generic model can be reused in
   * more concrete scenarios.
   */
  EXAMPLE = prefix + 'Example',

  /**
   * Determines that the artifact was created to support the design of an
   * information retrieval system.
   */
  INFORMATION_RETRIEVAL = prefix + 'InformationRetrieval',

  /**
   * Determines that the artifact was created to support data integration,
   * vocabulary alignment, or the interoperability of software systems.
   */
  INTEROPERABILITY = prefix + 'Interoperability',

  /**
   * Determines that the artifact was created for the design of a
   * domain-specific modeling language.
   */
  LANGUAGE_ENGINEERING = prefix + 'LanguageEngineering',

  /**
   * Determines that the artifact was created so that its authors could learn
   * UFO and OntoUML. This usually applies to models developed by students as
   * part of their course assignments.
   */
  LEARNING = prefix + 'Learning',

  /**
   * Determines that the artifact was created as the result of an ontological
   * analysis of a concept, language, or domain of interest that sought to
   * conceptually clarify and untangle complex notions and relations.
   */
  ONTOLOGICAL_ANALYSIS = prefix + 'OntologicalAnalysis',

  /**
   * Determines that the artifact was created during the development of an
   * information system. For instance, a conceptual model that is used to
   * generate a relational database.
   */
  SOFTWARE_ENGINEERING = prefix + 'SoftwareEngineering'
}

/**
 * The official `rdfs:label` of each individual in the OntoUML/UFO Catalog
 * Metadata Vocabulary, indexed by its URI.
 */
const labels: { [uri: string]: string } = {
  [OntologyDevelopmentContext.CLASSROOM]: 'Classroom Context',
  [OntologyDevelopmentContext.INDUSTRY]: 'Industry Context',
  [OntologyDevelopmentContext.RESEARCH]: 'Research Context',
  [OntologyRepresentationStyle.ONTOUML]: 'OntoUML Style',
  [OntologyRepresentationStyle.UFO]: 'UFO Style',
  [OntologyType.CORE]: 'Core Ontology',
  [OntologyType.DOMAIN]: 'Domain Ontology',
  [OntologyType.APPLICATION]: 'Application Ontology',
  [OntologyPurpose.CONCEPTUAL_CLARIFICATION]:
    'Conceptual Clarification Purpose',
  [OntologyPurpose.DATA_PUBLICATION]: 'Data Publication Purpose',
  [OntologyPurpose.DECISION_SUPPORT_SYSTEM]: 'Decision Support System Purpose',
  [OntologyPurpose.EXAMPLE]: 'Example Purpose',
  [OntologyPurpose.INFORMATION_RETRIEVAL]: 'Information Retrieval Purpose',
  [OntologyPurpose.INTEROPERABILITY]: 'Interoperability Purpose',
  [OntologyPurpose.LANGUAGE_ENGINEERING]: 'Language Engineering Purpose',
  [OntologyPurpose.LEARNING]: 'Learning Purpose',
  [OntologyPurpose.ONTOLOGICAL_ANALYSIS]: 'Ontological Analysis Purpose',
  [OntologyPurpose.SOFTWARE_ENGINEERING]: 'Software Engineering Purpose'
};

/**
 * Returns the official English label of an individual of the OntoUML/UFO
 * Catalog Metadata Vocabulary, or `undefined` if the URI does not identify
 * one.
 *
 * @param uri - the URI of a vocabulary individual, typically a value of
 *        {@link OntologyDevelopmentContext}, {@link OntologyPurpose},
 *        {@link OntologyRepresentationStyle}, or {@link OntologyType}.
 */
export function getMetadataLabel(uri: string): string | undefined {
  return labels[uri];
}
