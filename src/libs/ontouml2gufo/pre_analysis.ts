import randomId from 'random-id';
import isURI from 'validate.io-uri';
import {
  IPreAnalysisItem,
  IPackage,
  IOntoUML2GUFOOptions,
  IRelation,
} from '@types';
import { OntoUMLType } from '@constants/.';
import { DefaultPrefixes } from './constants';
import { getPrefixes } from './helper_functions';

/* 
  Pre-transformation preAnalysis to give users feedback about things that could potentially impact the transformation. Including:
  - Identify elements without name
  - Check invalid Base URI
  - Check invalid characters
  - Check repeated names (attributes, relation names and association ends, etc.)
  - Check plural association ends
  - Check package names prefixes that can clash with popular prefixes (rdfs, rdf, owl, etc)
*/
export async function runPreAnalysis(
  model: IPackage,
  options: IOntoUML2GUFOOptions,
): Promise<IPreAnalysisItem[]> {
  const { baseIRI } = options;
  const packages = model.getAllContentsByType([
    OntoUMLType.PACKAGE_TYPE,
  ]) as IPackage[];
  const relations = model.getAllContentsByType([
    OntoUMLType.RELATION_TYPE,
  ]) as IRelation[];

  const [
    baseIRIAnalysis,
    packageAnalysis,
    inexistentRelationNamesAnalysis,
  ] = await Promise.all([
    checkBaseIRI(baseIRI),
    checkPackagePrefixes(packages, options),
    checkInexistentRelationNames(relations, options),
  ]);

  return [
    ...baseIRIAnalysis,
    ...packageAnalysis,
    ...inexistentRelationNamesAnalysis,
  ];
}

async function checkBaseIRI(baseIRI: string): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];

  if (!isURI(baseIRI)) {
    preAnalysis.push({
      id: randomId(),
      code: 'invalid_base_iri',
      title: 'Invalid BaseIRI',
      detail: `${baseIRI} is not a valid IRI.`,
      meta: { baseIRI },
    });
  }

  return preAnalysis;
}

async function checkPackagePrefixes(
  packages: IPackage[],
  options: IOntoUML2GUFOOptions,
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];
  const { customPackageMapping, prefixPackages } = options;
  const defaultPrefixKeys = Object.keys(DefaultPrefixes);
  const defaultPrefixUris = Object.values(DefaultPrefixes);

  for (const key of Object.keys(customPackageMapping)) {
    const packageEl =
      packages.find(({ id, name }: IPackage) => id === key || name === key) ||
      {};
    const { prefix, uri } = customPackageMapping[key];

    if (defaultPrefixKeys.includes(prefix)) {
      preAnalysis.push({
        id: randomId(),
        code: 'invalid_custom_package_prefix',
        title: 'Invalid Custom Package Prefix',
        detail: `Prefix ${prefix} is a default gUFO package prefix`,
        meta: { element: packageEl },
      });
    }

    if (defaultPrefixUris.includes(uri)) {
      preAnalysis.push({
        id: randomId(),
        code: 'invalid_custom_package_uri',
        title: 'Invalid Custom Package URI',
        detail: `URI ${uri} is a default gUFO package uri`,
        meta: { element: packageEl },
      });
    }
  }

  if (prefixPackages) {
    const prefixes = getPrefixes(packages, options);

    for (const prefix of Object.keys(prefixes)) {
      const uri = prefixes[prefix];

      if (defaultPrefixKeys.includes(prefix)) {
        preAnalysis.push({
          id: randomId(),
          code: 'invalid_package_prefix',
          title: 'Invalid Package Prefix',
          detail: `Prefix ${prefix} is a default gUFO package prefix`,
          meta: { prefix, uri },
        });
      }

      if (defaultPrefixUris.includes(uri)) {
        preAnalysis.push({
          id: randomId(),
          code: 'invalid_package_uri',
          title: 'Invalid Package URI',
          detail: `URI ${uri} is a default gUFO package uri`,
          meta: { prefix, uri },
        });
      }
    }
  }

  return preAnalysis;
}

async function checkInexistentRelationNames(
  relations: IRelation[],
  options: IOntoUML2GUFOOptions,
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];
  const { createInverses } = options;

  relations.forEach((relation: IRelation) => {
    const { name, stereotypes, properties } = relation;
    const stereotype = stereotypes ? stereotypes[0] : null;
    const stereotypeName = stereotype ? `${stereotype} ` : '';
    const source = relation.getSource();
    const target = relation.getTarget();
    const sourceAssociationName = properties[0].name;
    const targetAssociationName = properties[1].name;

    if (!name && !targetAssociationName) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_relation_name',
        title: 'Inexistent Relation Name',
        detail: `${stereotypeName}relation between ${source.name} and ${target.name} do not have a proper name`,
        meta: { element: relation },
      });
    }

    if (createInverses && !sourceAssociationName) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_inverse_relation_name',
        title: 'Inexistent Inverse Relation Name',
        detail: `${stereotypeName}relation between ${target.name} and ${source.name} do not have a proper association end name`,
        meta: { element: relation },
      });
    }
  });

  return preAnalysis;
}
