// https://github.com/OntoUML/ontouml-js/wiki/OntoUML-Specialization-Table
import {
  RIGID,
  ANTI_RIGID,
  SEMI_RIGID,
  SORTAL,
  NON_SORTAL,
} from '@constants/stereotypes_constraints';

const KIND: 'ontouml/1.0/kind' = 'ontouml/1.0/kind';
const SUBKIND: 'ontouml/1.0/subkind' = 'ontouml/1.0/subkind';
const RELATOR: 'ontouml/1.0/relator' = 'ontouml/1.0/relator';
const MODE: 'ontouml/1.0/mode' = 'ontouml/1.0/mode';
const QUALITY: 'ontouml/1.0/quality' = 'ontouml/1.0/quality';
const QUANTITY: 'ontouml/1.0/quantity' = 'ontouml/1.0/quantity';
const COLLECTIVE: 'ontouml/1.0/collective' = 'ontouml/1.0/collective';
const CATEGORY: 'ontouml/1.0/category' = 'ontouml/1.0/category';
const ROLE: 'ontouml/1.0/role' = 'ontouml/1.0/role';
const PHASE: 'ontouml/1.0/phase' = 'ontouml/1.0/phase';
const MIXIN: 'ontouml/1.0/mixin' = 'ontouml/1.0/mixin';
const ROLE_MIXIN: 'ontouml/1.0/roleMixin' = 'ontouml/1.0/roleMixin';

const MATERIAL: 'ontouml/1.0/material' = 'ontouml/1.0/material';
const MEDIATION: 'ontouml/1.0/mediation' = 'ontouml/1.0/mediation';
const COMPONENT_OF: 'ontouml/1.0/componentOf' = 'ontouml/1.0/componentOf';
const SUBQUANTITY_OF: 'ontouml/1.0/subquantityOf' = 'ontouml/1.0/subquantityOf';
const CHARACTERIZATION: 'ontouml/1.0/characterization' =
  'ontouml/1.0/characterization';
const FORMAL: 'ontouml/1.0/formal' = 'ontouml/1.0/formal';
const MEMBER_OF: 'ontouml/1.0/memberOf' = 'ontouml/1.0/memberOf';
const SUBCOLLECTION_OF: 'ontouml/1.0/subcollectionOf' =
  'ontouml/1.0/subcollectionOf';
const DERIVATION: 'ontouml/1.0/derivation' = 'ontouml/1.0/derivation';

export const RELATIONS: IRelation[] = [
  {
    name: '«material»',
    id: MATERIAL,
    source: {
      lowerbound: 1,
      upperbound: '*',
    },
    target: {
      lowerbound: 1,
      upperbound: '*',
    },
  },
  {
    name: '«mediation»',
    id: MEDIATION,
    source: {
      lowerbound: 1,
      upperbound: '*',
    },
    target: {
      lowerbound: 1,
      upperbound: '*',
    },
  },
  {
    name: '«componentOf»',
    id: COMPONENT_OF,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: '*',
    },
  },
  {
    name: '«subquantityOf»',
    id: SUBQUANTITY_OF,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: 1,
    },
  },
  {
    name: '«characterization»',
    id: CHARACTERIZATION,
    source: {
      lowerbound: 1,
      upperbound: '*',
    },
    target: {
      lowerbound: 1,
      upperbound: 1,
    },
  },
  {
    name: '«formal»',
    id: FORMAL,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: '*',
    },
  },
  {
    name: '«memberOf»',
    id: MEMBER_OF,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: '*',
    },
  },
  {
    name: '«subcollectionOf»',
    id: SUBCOLLECTION_OF,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: '*',
    },
  },
  {
    name: '«derivation»',
    id: DERIVATION,
    source: {
      lowerbound: 0,
      upperbound: '*',
    },
    target: {
      lowerbound: 0,
      upperbound: '*',
    },
  },
];

export const STEREOTYPES: IStereotype[] = [
  {
    name: '«kind»',
    id: KIND,
    specializes: [CATEGORY, MIXIN],
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«subkind»',
    id: SUBKIND,
    specializes: [KIND, QUANTITY, COLLECTIVE, SUBKIND, CATEGORY, MIXIN],
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«relator»',
    id: RELATOR,
    specializes: [RELATOR],
    relations: {
      [KIND]: [MEDIATION, FORMAL, MATERIAL],
      [QUANTITY]: [MEDIATION, FORMAL, MATERIAL],
      [COLLECTIVE]: [MEDIATION, FORMAL, MATERIAL],
      [SUBKIND]: [MEDIATION, FORMAL, MATERIAL],
      [ROLE]: [MEDIATION, FORMAL, MATERIAL],
      [PHASE]: [MEDIATION, FORMAL, MATERIAL],
      [CATEGORY]: [MEDIATION, FORMAL, MATERIAL],
      [MIXIN]: [MEDIATION, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [MEDIATION, FORMAL, MATERIAL],
      [RELATOR]: [
        MEMBER_OF,
        COMPONENT_OF,
        MEDIATION,
        FORMAL,
        MATERIAL,
        SUBQUANTITY_OF,
        SUBCOLLECTION_OF,
      ],
      [MODE]: [MEDIATION, FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [MEDIATION, FORMAL, CHARACTERIZATION, MATERIAL],
      // derivations
      [MATERIAL]: [],
    },
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«mode»',
    id: MODE,
    specializes: [MODE],
    relations: {
      [KIND]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUANTITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [COLLECTIVE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [SUBKIND]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [ROLE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [PHASE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [CATEGORY]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [MIXIN]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [ROLE_MIXIN]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, CHARACTERIZATION, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«quality»',
    id: QUALITY,
    specializes: [QUALITY],
    relations: {
      [KIND]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUANTITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [COLLECTIVE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [SUBKIND]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [ROLE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [PHASE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [CATEGORY]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [MIXIN]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [ROLE_MIXIN]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, CHARACTERIZATION, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«quantity»',
    id: QUANTITY,
    specializes: [QUANTITY],
    relations: {
      [KIND]: [FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL, SUBQUANTITY_OF],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [FORMAL, MATERIAL],
      [PHASE]: [FORMAL, MATERIAL],
      [CATEGORY]: [FORMAL, MATERIAL],
      [MIXIN]: [FORMAL, MATERIAL],
      [ROLE_MIXIN]: [FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«collective»',
    id: COLLECTIVE,
    specializes: [CATEGORY, MIXIN],
    relations: {
      [KIND]: [MEMBER_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [MEMBER_OF, FORMAL, MATERIAL, SUBCOLLECTION_OF],
      [SUBKIND]: [MEMBER_OF, FORMAL, MATERIAL],
      [ROLE]: [MEMBER_OF, COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [MEMBER_OF, COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [MEMBER_OF, COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [MEMBER_OF, COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [MEMBER_OF, COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«category»',
    id: CATEGORY,
    specializes: [CATEGORY, MIXIN],
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«mixin»',
    id: MIXIN,
    specializes: [CATEGORY, MIXIN],
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: SEMI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«roleMixin»',
    id: ROLE_MIXIN,
    specializes: [CATEGORY, MIXIN, ROLE_MIXIN],
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    rigidity: ANTI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«role»',
    id: ROLE,
    specializes: [
      KIND,
      QUANTITY,
      COLLECTIVE,
      SUBKIND,
      ROLE,
      PHASE,
      MIXIN,
      ROLE_MIXIN,
      RELATOR,
    ],
    rigidity: ANTI_RIGID,
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«phase»',
    id: PHASE,
    specializes: [
      KIND,
      QUANTITY,
      COLLECTIVE,
      SUBKIND,
      ROLE,
      PHASE,
      MIXIN,
      ROLE_MIXIN,
      RELATOR,
    ],
    rigidity: ANTI_RIGID,
    relations: {
      [KIND]: [COMPONENT_OF, FORMAL, MATERIAL],
      [QUANTITY]: [FORMAL, MATERIAL],
      [COLLECTIVE]: [FORMAL, MATERIAL],
      [SUBKIND]: [FORMAL, MATERIAL],
      [ROLE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [PHASE]: [COMPONENT_OF, FORMAL, MATERIAL],
      [CATEGORY]: [COMPONENT_OF, FORMAL, MATERIAL],
      [MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [ROLE_MIXIN]: [COMPONENT_OF, FORMAL, MATERIAL],
      [RELATOR]: [MEDIATION, FORMAL, MATERIAL],
      [MODE]: [FORMAL, CHARACTERIZATION, MATERIAL],
      [QUALITY]: [FORMAL, CHARACTERIZATION, MATERIAL],
    },
    sortality: SORTAL,
    ultimateSortal: false,
  },
];
