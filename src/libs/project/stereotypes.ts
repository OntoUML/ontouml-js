import { ClassStereotype, OntoumlStereotype, PropertyStereotype, RelationStereotype } from '@constants/.';
import _ from 'lodash';

const ClassStereotypes = Object.values(ClassStereotype);

const RelationStereotypes = Object.values(RelationStereotype);

const PropertyStereotypes = Object.values(PropertyStereotype);

const ExistentialDependencyRelationStereotypes = [
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.CHARACTERIZATION,
  RelationStereotype.CREATION,
  RelationStereotype.EXTERNAL_DEPENDENCE,
  RelationStereotype.HISTORICAL_DEPENDENCE,
  RelationStereotype.MANIFESTATION,
  RelationStereotype.PARTICIPATION,
  RelationStereotype.PARTICIPATIONAL,
  RelationStereotype.MEDIATION,
  RelationStereotype.TERMINATION,
  RelationStereotype.TRIGGERS
];

const ExistentialDependentSourceRelationStereotypes: string[] = [
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.CREATION,
  RelationStereotype.MANIFESTATION,
  RelationStereotype.PARTICIPATION,
  RelationStereotype.PARTICIPATIONAL,
  RelationStereotype.TERMINATION,
  RelationStereotype.TRIGGERS
];

const ExistentialDependentTargetRelationStereotypes: string[] = [
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.CHARACTERIZATION,
  RelationStereotype.CREATION,
  RelationStereotype.EXTERNAL_DEPENDENCE,
  RelationStereotype.HISTORICAL_DEPENDENCE,
  RelationStereotype.MEDIATION,
  RelationStereotype.PARTICIPATIONAL
];

Object.freeze(ClassStereotypes);
Object.freeze(RelationStereotypes);
Object.freeze(PropertyStereotypes);
Object.freeze(ExistentialDependencyRelationStereotypes);
Object.freeze(ExistentialDependentSourceRelationStereotypes);
Object.freeze(ExistentialDependentTargetRelationStereotypes);

function isClassStereotype(stereotype: OntoumlStereotype): boolean {
  return ClassStereotypes.includes(stereotype as any);
}

function isRelationStereotype(stereotype: OntoumlStereotype): boolean {
  return RelationStereotypes.includes(stereotype as any);
}

function isPropertyStereotype(stereotype: OntoumlStereotype): boolean {
  return PropertyStereotypes.includes(stereotype as any);
}

export const stereotypes = {
  ClassStereotypes,
  RelationStereotypes,
  PropertyStereotypes,
  ExistentialDependencyRelationStereotypes,
  ExistentialDependentSourceRelationStereotypes,
  ExistentialDependentTargetRelationStereotypes,
  isClassStereotype,
  isRelationStereotype,
  isPropertyStereotype
};
