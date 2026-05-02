import { Generalization, GeneralizationSet, OntoumlType } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { getNormalizedName } from './util';

export function transformGeneralizationSet(transformer: Ontouml2Alloy, genSet: GeneralizationSet) {
  if (!genSet.generalizations || genSet.generalizations.length === 0 || (!genSet.isComplete && !genSet.isDisjoint)) {
    return;
  }

  const classChildren = (genSet.generalizations as Generalization[])
    .map(gen => gen.specific)
    .filter(child => child.type === OntoumlType.CLASS_TYPE);
  const onlyClassChildren = classChildren.length === genSet.generalizations.length;

  if (!onlyClassChildren) {
    return;
  }

  const classParents = (genSet.generalizations as Generalization[])
    .map(gen => gen.general)
    .filter(parent => parent && parent.type === OntoumlType.CLASS_TYPE);
  const onlyClassParents = classParents.length === genSet.generalizations.length;
  const uniqueParent = classParents.length > 0 && classParents.every(p => p === classParents[0]);

  if (!onlyClassParents || !uniqueParent) {
    return;
  }

  const parent = classParents[0];

  const children = (genSet.generalizations as Generalization[]).map(gen => getNormalizedName(transformer, gen.specific));

  const constraints: string[] = [];
  
  if (genSet.isDisjoint && children.length > 1) {
    constraints.push('        disj[' + children.join(',') + ']');
  }
  if (genSet.isComplete) {
    constraints.push('        ' + getNormalizedName(transformer, parent) + ' = ' + children.join('+'));
  }
  if (constraints.length === 0) {
    return;
  }

  const fact = 'fact generalizationSet {\n' + constraints.join('\n') + '\n}';

  transformer.addFact(fact);
}
