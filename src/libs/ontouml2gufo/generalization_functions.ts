import { IClassifier, IGeneralization } from '@types';
import { Writer } from 'n3';
import { isClass, isRelation } from './helper_functions';
import Options from './options';
import { getUri } from './uri_manager';

const N3 = require('n3');
const { namedNode } = N3.DataFactory;

export function transformGeneralization(writer: Writer, generalization: IGeneralization, options: Options) {
  const specific = generalization.specific as IClassifier;
  const general = generalization.general as IClassifier;

  const specificUri = getUri(specific, options);
  const generalUri = getUri(general, options);

  if (isClass(specific) && isClass(general))
    writer.addQuad(namedNode(specificUri), namedNode('rdfs:subClassOf'), namedNode(generalUri));

  if (isRelation(specific) && isRelation(general))
    writer.addQuad(namedNode(specificUri), namedNode('rdfs:subPropertyOf'), namedNode(generalUri));
}
