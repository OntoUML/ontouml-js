import { IRelation, IOntoUML2GUFOOptions } from '@types';
import { AggregationKind, ClassStereotype } from '@constants/.';
import {
  HideObjectPropertyCreationList,
  HideReadOnlyObjectPropertyCreationList,
  AspectProperPartClassStereotypeList,
  ObjectProperPartClassStereotypeList,
} from './constants';

// generated relation properties to be used in the transformation
export function generateExtraPropertyAssignments(relation: IRelation, options: IOntoUML2GUFOOptions) {
  const { createObjectProperty } = options;
  const { stereotypes } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;

  const { properties } = relation;

  // source and target information
  const sourceClass = relation.getSource();
  const targetClass = relation.getTarget();
  const sourceStereotype = sourceClass.stereotypes ? sourceClass.stereotypes[0] : null;
  const targetStereotype = targetClass.stereotypes ? targetClass.stereotypes[0] : null;

  // part-whole checking
  const partWholeKinds = [AggregationKind.SHARED, AggregationKind.COMPOSITE];

  const isPartWholeRelation =
    partWholeKinds.includes(properties[0].aggregationKind) ||
    partWholeKinds.includes(properties[1].aggregationKind);

  const isPartWholeRelationBetweenEvents =
    isPartWholeRelation &&
    sourceStereotype === ClassStereotype.EVENT &&
    targetStereotype === ClassStereotype.EVENT;
  const isPartWholeRelationBetweenAspects =
    isPartWholeRelation &&
    AspectProperPartClassStereotypeList.includes(sourceStereotype) &&
    AspectProperPartClassStereotypeList.includes(targetStereotype);
  const isPartWholeRelationBetweenObjects =
    isPartWholeRelation &&
    ObjectProperPartClassStereotypeList.includes(sourceStereotype) &&
    ObjectProperPartClassStereotypeList.includes(targetStereotype);
  const isPartWholeRelationWithoutStereotype = isPartWholeRelation && !stereotype;
  const isPartWholeRelationBetweenEventsWithoutStereotype = isPartWholeRelationBetweenEvents && !stereotype;
  const isReadOnlyRelation = properties[0].isReadOnly || properties[1].isReadOnly;
  const isPartWholeInverted = partWholeKinds.includes(properties[0].aggregationKind);

  // isInverse checking
  const isInvertedRelation = isPartWholeInverted;

  // hideObjectPropertyCreation checking
  const hideNormalBaseCreation =
    !createObjectProperty &&
    (HideObjectPropertyCreationList.includes(stereotype) || isPartWholeRelationWithoutStereotype);
  const hideReadOnlyBaseCreation =
    !createObjectProperty &&
    isReadOnlyRelation &&
    HideReadOnlyObjectPropertyCreationList.includes(stereotype);
  const hideBaseCreation = hideNormalBaseCreation || hideReadOnlyBaseCreation;

  // add extra properties
  return {
    isPartWholeRelation,
    isPartWholeRelationBetweenEvents,
    isPartWholeRelationBetweenAspects,
    isPartWholeRelationBetweenObjects,
    isPartWholeRelationWithoutStereotype,
    isPartWholeRelationBetweenEventsWithoutStereotype,
    isInvertedRelation,
    hideBaseCreation,
  };
}
