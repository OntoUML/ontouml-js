import { OntologicalNature } from './constants';

const EndurantNatures = [
  OntologicalNature.functional_complex,
  OntologicalNature.collective,
  OntologicalNature.quantity,
  OntologicalNature.intrinsic_mode,
  OntologicalNature.extrinsic_mode,
  OntologicalNature.quality,
  OntologicalNature.relator
];

const SubstantialNatures = [OntologicalNature.functional_complex, OntologicalNature.collective, OntologicalNature.quantity];

const MomentNatures = [
  OntologicalNature.intrinsic_mode,
  OntologicalNature.extrinsic_mode,
  OntologicalNature.quality,
  OntologicalNature.relator
];

const IntrinsicMomentNatures = [OntologicalNature.intrinsic_mode, OntologicalNature.quality];

const ExtrinsicMomentNatures = [OntologicalNature.extrinsic_mode, OntologicalNature.relator];

const naturesArrays = [EndurantNatures, SubstantialNatures, MomentNatures, IntrinsicMomentNatures, ExtrinsicMomentNatures];
naturesArrays.forEach((array: OntologicalNature[]) => Object.freeze(array));

export const natureUtils = {
  EndurantNatures,
  SubstantialNatures,
  MomentNatures,
  IntrinsicMomentNatures,
  ExtrinsicMomentNatures
};
