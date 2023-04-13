import { Generalization, GeneralizationSet, OntoumlType } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { normalizeName } from './util';

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

  const classParents = genSet.generalizations.map((gen: Generalization) => gen.getGeneralClass());
  const onlyClassParent = classParents.length === genSet.generalizations.length;
  const parent = genSet.getGeneralClass();
  const uniqueParent = !!parent;

  if (!uniqueParent || !onlyClassParent) {
    return;
  }

  const children = (genSet.generalizations as Generalization[])
    .map(gen => normalizeName(transformer, gen.specific));

  let fact = 'fact generalizationSet {\n';
  if (genSet.isDisjoint) fact += '        disjoint[' + children.join(',') + ']\n';
  if (genSet.isComplete) fact += '        ' + normalizeName(transformer, parent) + ' = ' + children.join('+') + '\n';
  fact += '}';

  transformer.addFact(fact);
}
