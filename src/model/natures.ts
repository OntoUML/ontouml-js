export enum Nature {
  FUNCTIONAL_COMPLEX = 'functional-complex',
  COLLECTIVE = 'collective',
  QUANTITY = 'quantity',
  RELATOR = 'relator',
  INTRINSIC_MODE = 'intrinsic-mode',
  EXTRINSIC_MODE = 'extrinsic-mode',
  QUALITY = 'quality',
  EVENT = 'event',
  SITUATION = 'situation',
  TYPE = 'type',
  ABSTRACT = 'abstract'
}

export const Natures: readonly Nature[]  = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY,
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR,
  Nature.EVENT,
  Nature.SITUATION,
  Nature.TYPE,
  Nature.ABSTRACT
];

export const EndurantNatures: readonly Nature[]  = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY,
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR
];

export const SubstantialNatures: readonly Nature[]  = [Nature.FUNCTIONAL_COMPLEX, Nature.COLLECTIVE, Nature.QUANTITY];

export const MomentNatures: readonly Nature[]  = [
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR
];

export const IntrinsicMomentNatures: readonly Nature[] = [Nature.INTRINSIC_MODE, Nature.QUALITY];

export const ExtrinsicMomentNatures: readonly Nature[]  = [Nature.EXTRINSIC_MODE, Nature.RELATOR];
