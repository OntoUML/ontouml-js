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
    name: '«quantityKind»',
    id: QUANTITY_KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«collectiveKind»',
    id: COLLECTIVE_KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«subkind»',
    id: SUBKIND,
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
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«role»',
    id: ROLE,
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
    rigidity: ANTI_RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«phase»',
    id: PHASE,
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
    rigidity: ANTI_RIGID,
    sortality: SORTAL,
    ultimateSortal: false,
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
    specializes: [CATEGORY, MIXIN, ROLE_MIXIN, PHASE_MIXIN],
    rigidity: ANTI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«phaseMixin»',
    id: PHASE_MIXIN,
    specializes: [CATEGORY, MIXIN, PHASE_MIXIN],
    rigidity: ANTI_RIGID,
    sortality: NON_SORTAL,
    ultimateSortal: false,
  },
  {
    name: '«relatorKind»',
    id: RELATOR_KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«modeKind»',
    id: MODE_KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
  {
    name: '«qualityKind»',
    id: QUALITY_KIND,
    specializes: [CATEGORY, MIXIN],
    rigidity: RIGID,
    sortality: SORTAL,
    ultimateSortal: true,
  },
];
