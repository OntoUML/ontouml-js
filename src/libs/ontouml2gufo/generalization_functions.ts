import { IClassifier, IGeneralization } from '@types';
import Ontouml2Gufo from './ontouml2gufo';
import { isClass, isRelation } from './helper_functions';

export function transformGeneralization(transformer: Ontouml2Gufo, generalization: IGeneralization) {
  const specific = generalization.specific as IClassifier;
  const general = generalization.general as IClassifier;

  const specificUri = transformer.getUri(specific);
  const generalUri = transformer.getUri(general);

  if (isClass(specific) && isClass(general)) {
    transformer.addQuad(specificUri, 'rdfs:subClassOf', generalUri);
  }

  if (isRelation(specific) && isRelation(general)) {
    transformer.addQuad(specificUri, 'rdfs:subPropertyOf', generalUri);
  }
}
