import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { normalizeName } from './util';

export function transformGeneralization(transformer: Ontouml2Alloy, gen: Generalization) {
  const specificName = normalizeName(gen.specific);
  const generalName = normalizeName(gen.general)

  transformer.addFact(
    'fact generalization {\n' +
    '        ' + specificName + ' in ' + generalName + '\n' +
    '}'
  );
}
