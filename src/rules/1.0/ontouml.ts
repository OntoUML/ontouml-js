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

export const STEREOTYPES: IStereotype[] = [
  {
    name: '«kind»',
    id: KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«subkind»',
    id: SUBKIND,
    specializes: [KIND, QUANTITY, COLLECTIVE, SUBKIND, CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«relator»',
    id: RELATOR,
    specializes: [RELATOR],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«mode»',
    id: MODE,
    specializes: [MODE],
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«quality»',
    id: QUALITY,
    specializes: [QUALITY],
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«quantity»',
    id: QUANTITY,
    specializes: [QUANTITY],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«collective»',
    id: COLLECTIVE,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«category»',
    id: CATEGORY,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«mixin»',
    id: MIXIN,
    specializes: [CATEGORY, MIXIN],
    rigidity: SEMI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«roleMixin»',
    id: ROLE_MIXIN,
    specializes: [CATEGORY, MIXIN, ROLE_MIXIN],
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
    sortality: SORTAL,
    ultimateSortal: false,
  },
];
