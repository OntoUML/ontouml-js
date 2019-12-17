// https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Specialization-Table
import {
  RIGID,
  ANTI_RIGID,
  SEMI_RIGID,
  SORTAL,
  NON_SORTAL,
} from '@constants/stereotypes_constraints';

const KIND: 'ontouml/2.0/kind' = 'ontouml/2.0/kind';
const QUANTITY_KIND: 'ontouml/2.0/quantityKind' = 'ontouml/2.0/quantityKind';
const COLLECTIVE_KIND: 'ontouml/2.0/collectiveKind' =
  'ontouml/2.0/collectiveKind';
const SUBKIND: 'ontouml/2.0/subkind' = 'ontouml/2.0/subkind';
const ROLE: 'ontouml/2.0/role' = 'ontouml/2.0/role';
const PHASE: 'ontouml/2.0/phase' = 'ontouml/2.0/phase';
const CATEGORY: 'ontouml/2.0/category' = 'ontouml/2.0/category';
const MIXIN: 'ontouml/2.0/mixin' = 'ontouml/2.0/mixin';
const ROLE_MIXIN: 'ontouml/2.0/roleMixin' = 'ontouml/2.0/roleMixin';
const PHASE_MIXIN: 'ontouml/2.0/phaseMixin' = 'ontouml/2.0/phaseMixin';
const RELATOR_KIND: 'ontouml/2.0/relatorKind' = 'ontouml/2.0/relatorKind';
const MODE_KIND: 'ontouml/2.0/modeKind' = 'ontouml/2.0/modeKind';
const QUALITY_KIND: 'ontouml/2.0/qualityKind' = 'ontouml/2.0/qualityKind';

const MATERIAL: 'ontouml/2.0/material' = 'ontouml/2.0/material';
const MEDIATION: 'ontouml/2.0/mediation' = 'ontouml/2.0/mediation';
const COMPARATIVE: 'ontouml/2.0/comparative' = 'ontouml/2.0/comparative';
const HISTORICAL: 'ontouml/2.0/historical' = 'ontouml/2.0/historical';
const EXTERNAL_DEPENDENCE: 'ontouml/2.0/externalDependence' =
  'ontouml/2.0/externalDependence';
const CHARACTERIZATION: 'ontouml/2.0/characterization' =
  'ontouml/2.0/characterization';
const DERIVATION: 'ontouml/2.0/derivation' = 'ontouml/2.0/derivation';
const COMPONENT_OF: 'ontouml/2.0/componentOf' = 'ontouml/2.0/componentOf';
const SUBQUANTITY_OF: 'ontouml/2.0/subquantityOf' = 'ontouml/2.0/subquantityOf';
const MEMBER_OF: 'ontouml/2.0/memberOf' = 'ontouml/2.0/memberOf';
const SUBCOLLECTION_OF: 'ontouml/2.0/subcollectionOf' =
  'ontouml/2.0/subcollectionOf';

export const RELATIONSHIPS: IRelationship[] = [
  {
    name: '«material»',
    uri: MATERIAL,
  },
  {
    name: '«mediation»',
    uri: MEDIATION,
  },
  {
    name: '«characterization»',
    uri: CHARACTERIZATION,
  },
  {
    name: '«comparative»',
    uri: COMPARATIVE,
  },
  {
    name: '«historical»',
    uri: HISTORICAL,
  },
  {
    name: '«externalDependence»',
    uri: EXTERNAL_DEPENDENCE,
  },
  {
    name: '«derivation»',
    uri: DERIVATION,
  },
  {
    name: '«componentOf»',
    uri: COMPONENT_OF,
  },
  {
    name: '«subquantityOf»',
    uri: SUBQUANTITY_OF,
  },
  {
    name: '«memberOf»',
    uri: MEMBER_OF,
  },
  {
    name: '«subcollectionOf»',
    uri: SUBCOLLECTION_OF,
  },
];

export const STEREOTYPES: IStereotype[] = [
  {
    name: '«kind»',
    uri: KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«quantityKind»',
    uri: QUANTITY_KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«collectiveKind»',
    uri: COLLECTIVE_KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«subkind»',
    uri: SUBKIND,
    specializes: [
      KIND,
      QUANTITY_KIND,
      COLLECTIVE_KIND,
      SUBKIND,
      CATEGORY,
      MIXIN,
      RELATOR_KIND,
      MODE_KIND,
      QUANTITY_KIND,
    ],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«role»',
    uri: ROLE,
    specializes: [
      KIND,
      QUANTITY_KIND,
      COLLECTIVE_KIND,
      SUBKIND,
      ROLE,
      PHASE,
      MIXIN,
      ROLE_MIXIN,
      PHASE_MIXIN,
      RELATOR_KIND,
      MODE_KIND,
      QUALITY_KIND,
    ],
    relations: {},
    rigidity: ANTI_RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«phase»',
    uri: PHASE,
    specializes: [
      KIND,
      QUANTITY_KIND,
      COLLECTIVE_KIND,
      SUBKIND,
      PHASE,
      MIXIN,
      PHASE_MIXIN,
      RELATOR_KIND,
      MODE_KIND,
      QUALITY_KIND,
    ],
    relations: {},
    rigidity: ANTI_RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«category»',
    uri: CATEGORY,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«mixin»',
    uri: MIXIN,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: SEMI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«roleMixin»',
    uri: ROLE_MIXIN,
    specializes: [CATEGORY, MIXIN, ROLE_MIXIN, PHASE_MIXIN],
    relations: {},
    rigidity: ANTI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«phaseMixin»',
    uri: PHASE_MIXIN,
    specializes: [CATEGORY, MIXIN, PHASE_MIXIN],
    relations: {},
    rigidity: ANTI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«relatorKind»',
    uri: RELATOR_KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«modeKind»',
    uri: MODE_KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«qualityKind»',
    uri: QUALITY_KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {},
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
];
