import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { getNormalizedName } from './util';

export function transformGeneralization(transformer: Ontouml2Alloy, gen: Generalization) {
  const specificName = getNormalizedName(transformer, gen.specific);
  const generalName = getNormalizedName(transformer, gen.general)

  transformer.addFact(
    'fact generalization {\n' +
    '        ' + specificName + ' in ' + generalName + '\n' +
    '}'
  );
}
