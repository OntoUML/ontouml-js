import _ from 'lodash';

const prefix = 'https://w3id.org/ontouml-models/vocabulary#';

export enum OntologyDevelopmentContext {
  CLASSROOM = prefix + 'Classroom',
  INDUSTRY = prefix + 'Industry',
  RESEARCH = prefix + 'Research'
}

export enum OntologyRepresentationStyle {
  ONTOUML = prefix + 'OntoumlStyle',
  UFO = prefix + 'UfoStyle'
}

export enum OntologyType {
  CORE = prefix + 'Core',
  DOMAIN = prefix + 'Domain',
  APPLICATION = prefix + 'Application'
}

export enum OntologyPurpose {
  CONCEP_CLARIF = prefix + 'ConceptualClarification',
  DATA_PUB = prefix + 'DataPublication',
  DSS = prefix + 'DecisionSupportSystem',
  EXAMPLE = prefix + 'Example',
  INFO_RET = prefix + 'InformationRetrieval',
  INTEROP = prefix + 'Interoperability',
  LANG_ENG = prefix + 'LanguageEngineering',
  LEARNING = prefix + 'Learning',
  ONT_ANALYSIS = prefix + 'OntologicalAnalysis',
  SOFT_ENG = prefix + 'SoftwareEngineering'
}
