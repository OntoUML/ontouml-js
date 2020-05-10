import { IClass, IRelation } from '@types';
import { OntoUMLType, RelationStereotype } from '@constants/.';

const basicMapping = {
  abstract: 'gufo:QualityValue',
  collective: 'gufo:Collection',
  event: 'gufo:Event',
  'functional-complex': 'gufo:FunctionalComplex',
  mode: 'gufo:IntrinsicAspect',
  quality: 'gufo:Quality',
  quantity: 'gufo:Quantity',
  relator: 'gufo:Relator',
  type: 'gufo:ConcreteIndividualType',
};

export function getModeGufoParentFromRelations(classElement: IClass): string {
  const relations = classElement.getRelations();
  const relationStereotypes = relations
    .filter((relation: IRelation) => relation.stereotypes !== null)
    .map((relation: IRelation) => relation.stereotypes[0]);

  return relationStereotypes.includes(RelationStereotype.CHARACTERIZATION) &&
    relationStereotypes.includes(RelationStereotype.EXTERNAL_DEPENDENCE)
    ? 'gufo:ExtrinsicMode'
    : 'gufo:IntrinsicMode';
}

export function getCollectiveGufoParent(classElement: IClass): string {
  if (classElement.isExtensional === null) return 'gufo:Collection';

  if (classElement.isExtensional) return 'gufo:FixedCollection';

  return 'gufo:VariableCollection';
}

export function getGufoParentFromAllowed(classElement: IClass): string {
  const allowed = classElement.allowed;

  if (!allowed || allowed.length === 0) return null;

  // Allows a single ontological nature
  if (allowed.length === 1) {
    const nature = allowed[0];

    if (nature === 'mode') return getModeGufoParentFromRelations(classElement);

    if (nature === 'collective') return getCollectiveGufoParent(classElement);

    return basicMapping[nature];
  }

  // Allows multiple ontological natures
  if (allowed.includes('type')) return 'owl:Thing';

  if (allowed.includes('abstract')) return 'gufo:Individual';

  if (allowed.includes('event')) return 'gufo:ConcreteIndividual';

  if (
    !allowed.includes('collective') &&
    !allowed.includes('functional-complex') &&
    !allowed.includes('quantity')
  )
    return 'gufo:Aspect';

  if (
    !allowed.includes('quality') &&
    !allowed.includes('mode') &&
    !allowed.includes('relator')
  )
    return 'gufo:Object';

  return 'gufo:Endurant';
}

export function getGufoParent(classElement: IClass): string {
  const parents = classElement.getParents() || [];
  const allowed = classElement.allowed || [];

  // The class has no parents...
  if (parents.length === 0) return getGufoParentFromAllowed(classElement);

  // The class has multiple parents...
  // Checks the allowed nature of its parents
  let hasSameNatureAsAParent = false;
  for (let parent of parents) {
    if (parent.type !== OntoUMLType.CLASS_TYPE) continue;

    const parentAllowed = (parent as IClass).allowed || [];
    const containsAll = (source, target) =>
      target.every(v => source.includes(v));

    if (
      containsAll(allowed, parentAllowed) &&
      containsAll(parentAllowed, allowed)
    ) {
      hasSameNatureAsAParent = true;
      break;
    }
  }

  // ... and at least one parent has the same nature
  if (hasSameNatureAsAParent) return null;

  // ... and no parent has the same nature
  return getGufoParentFromAllowed(classElement);
}
