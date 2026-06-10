import { Generalization, GeneralizationSet } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { getNormalizedName } from './util';

export function transformGeneralizationSet(transformer: Ontouml2Alloy, genSet: GeneralizationSet) {
  if (!genSet.generalizations || genSet.generalizations.length === 0 || (!genSet.isComplete && !genSet.isDisjoint)) {
    return;
  }

  const parent = genSet.getGeneralClass();
  if (!parent) {
    return;
  }

  const children = (genSet.generalizations as Generalization[]).map(gen => getNormalizedName(transformer, gen.specific));

  let fact = 'fact generalizationSet {\n';
  if (genSet.isDisjoint && children.length > 1) fact += '        disj[' + children.join(',') + ']\n';
  if (genSet.isComplete) fact += '        ' + getNormalizedName(transformer, parent) + ' = ' + children.join('+') + '\n';
  fact += '}';

  transformer.addFact(fact);
}
