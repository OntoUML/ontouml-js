import { Generalization } from '@libs/ontouml';
import { Ontouml2Alloy } from './';
import { getNameNoSpaces } from './util';

export function transformGeneralization(transformer: Ontouml2Alloy, gen: Generalization) {
  const specificName = getNameNoSpaces(gen.specific);
  const generalName = getNameNoSpaces(gen.general)

  transformer.addFact(
    'fact generalization {\n' +
    '        ' + specificName + ' in ' + generalName + '\n' +
    '}'
  );
}
