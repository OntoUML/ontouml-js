import randomId from 'random-id';
import isURI from 'validate.io-uri';
import pluralize from 'pluralize';
import {
  IPreAnalysisItem,
  IPackage,
  IOntoUML2GUFOOptions,
  IRelation,
  IElement,
  IClass,
  IProperty,
} from '@types';
import { OntoUMLType } from '@constants/.';
import { DefaultPrefixes } from './constants';
import { getPrefixes } from './helper_functions';

/* 
  Pre-transformation preAnalysis to give users feedback about things that could potentially impact the transformation. Including:
  - Identify elements without name
  - Check invalid Base URI
  - Check package names prefixes that can clash with popular prefixes (rdfs, rdf, owl, etc)
  - Check repeated names (attributes, relation names and association ends, etc.)
  - Check plural association ends
  - Check relations without cardinality
  - Check attributes without type
*/
export async function runPreAnalysis(
  model: IPackage,
  options: IOntoUML2GUFOOptions,
): Promise<IPreAnalysisItem[]> {
  const { baseIRI } = options;
  const elements = model.getAllContents();
  const packages = model.getAllContentsByType([
    OntoUMLType.PACKAGE_TYPE,
  ]) as IPackage[];
  const classes = model.getAllContentsByType([
    OntoUMLType.CLASS_TYPE,
  ]) as IClass[];
  const relations = model.getAllContentsByType([
    OntoUMLType.RELATION_TYPE,
  ]) as IRelation[];

  const [
    baseIRIAnalysis,
    packageAnalysis,
    inexistentRelationNamesAnalysis,
    pluralAssociationEndAnalysis,
    repeatedNameAnalysis,
    inexistentCardinality,
    inexistentAttributesType,
  ] = await Promise.all([
    checkBaseIRI(baseIRI),
    checkPackagePrefixes(packages, options),
    checkInexistentRelationNames(relations, options),
    checkPluralAssociationEnd(relations, options),
    checkRepeatedNames(elements),
    checkInexistentCardinality(relations),
    checkInexistentAttributesType(classes),
  ]);

  return [
    ...baseIRIAnalysis,
    ...packageAnalysis,
    ...inexistentRelationNamesAnalysis,
    ...pluralAssociationEndAnalysis,
    ...repeatedNameAnalysis,
    ...inexistentCardinality,
    ...inexistentAttributesType,
  ];
}

async function checkBaseIRI(baseIRI: string): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];

  if (!isURI(baseIRI)) {
    preAnalysis.push({
      id: randomId(),
      code: 'invalid_base_iri',
      title: 'Invalid BaseIRI',
      detail: `"${baseIRI}" is not a valid IRI.`,
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
        title: 'Protected prefix provided in custom package mapping',
        detail: `The prefix "${prefix}" is already used by another package imported by gUFO. Avoid using the following prefixes: ${defaultPrefixKeys.join(
          ', ',
        )}.`,
        meta: { element: packageEl },
      });
    }

    if (defaultPrefixUris.includes(uri)) {
      preAnalysis.push({
        id: randomId(),
        code: 'invalid_custom_package_uri',
        title: 'Protected URI provided in custom package mapping',
        detail: `The URI "${uri}" is already used by another package imported by gUFO.`,
        meta: { element: packageEl },
      });
    }
  }

  if (prefixPackages) {
    const prefixes = await getPrefixes(packages, options);

    for (const prefix of Object.keys(prefixes)) {
      const uri = prefixes[prefix];

      if (defaultPrefixKeys.includes(prefix)) {
        preAnalysis.push({
          id: randomId(),
          code: 'invalid_package_prefix',
          title: 'Protected prefix generated in package mapping',
          detail: `The prefix "${prefix}" is already used by another package imported by gUFO. Beware of the following prefixes: ${defaultPrefixKeys.join(
            ', ',
          )}.`,
          meta: { prefix, uri },
        });
      }

      if (defaultPrefixUris.includes(uri)) {
        preAnalysis.push({
          id: randomId(),
          code: 'invalid_package_uri',
          title: 'Protected URI generated in package mapping',
          detail: `The URI "${uri}" is already used by another package imported by gUFO.`,
          meta: { prefix, uri },
        });
      }
    }
  }

  return preAnalysis;
}

async function checkPluralAssociationEnd(
  relations: IRelation[],
  options: IOntoUML2GUFOOptions,
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];
  const { createInverses } = options;

  relations.forEach((relation: IRelation) => {
    const { properties } = relation;
    const source = relation.getSource();
    const target = relation.getTarget();
    const sourceAssociationName = properties[0].name;
    const targetAssociationName = properties[1].name;

    if (
      targetAssociationName &&
      targetAssociationName !== pluralize.singular(targetAssociationName)
    ) {
      preAnalysis.push({
        id: randomId(),
        code: 'plural_target_association_end',
        title: 'Plural name used in association end',
        detail: `The plural name "${targetAssociationName}" is used in the target end of relation "${relation.name}", which holds between between "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }

    if (
      createInverses &&
      sourceAssociationName &&
      sourceAssociationName !== pluralize.singular(sourceAssociationName)
    ) {
      preAnalysis.push({
        id: randomId(),
        code: 'plural_source_association_end',
        title: 'Plural name used in association end',
        detail: `The plural name "${sourceAssociationName}" is used in the source end of relation "${relation.name}", which holds between between "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }
  });

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
    const stereotypeName = stereotype ? `<<${stereotype}>>` : '';
    const source = relation.getSource();
    const target = relation.getTarget();
    const sourceAssociationName = properties[0].name;
    const targetAssociationName = properties[1].name;

    if (!name && !targetAssociationName) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_relation_name',
        title: 'Missing relation name',
        detail: `Missing name on ${stereotypeName} relation between classes "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }

    if (createInverses && !sourceAssociationName) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_inverse_relation_name',
        title: 'Missing inverse relation name',
        detail: `Missing inverse name for ${stereotypeName} relation between classes "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }
  });

  return preAnalysis;
}

async function checkRepeatedNames(
  elements: IElement[],
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];
  const elementNames = {};

  elements.forEach((element: IElement) => {
    const { name } = element;

    if (name) {
      if (!elementNames[name]) {
        elementNames[name] = [element];
      } else {
        elementNames[name].push(element);
      }
    }
  });

  for (const name of Object.keys(elementNames)) {
    const repeatedElements = elementNames[name];

    if (repeatedElements.length > 1) {
      const names = repeatedElements.map((element: IElement) => {
        if (element.type === OntoUMLType.PROPERTY_TYPE) {
          const property = element as IProperty;
          const parent = property._container as IElement;

          if (parent.type === OntoUMLType.RELATION_TYPE) {
            const relation = parent as IRelation;
            const source = relation.getSource();
            const target = relation.getTarget();

            return `association end "${element.name}" of relation "${relation.name}" between classes "${source.name}" and "${target.name}"`;
          }

          return `attribute "${element.name}" of class ${parent.name}`;
        }

        if (element.type === OntoUMLType.RELATION_TYPE) {
          const relation = element as IRelation;
          const source = relation.getSource();
          const target = relation.getTarget();

          return `relation "${relation.name}" between classes "${source.name}" and "${target.name}"`;
        }

        return `${element.type.toLowerCase()} "${element.name}"`;
      });

      preAnalysis.push({
        id: randomId(),
        code: 'repeated_names',
        title: 'Duplicate element name',
        detail: `The name "${name}" has been used multiple times: ${names
          .join(', ')
          .replace(/,(?!.*,)/gim, ' and')}.`,
        meta: { elements: repeatedElements },
      });
    }
  }

  return preAnalysis;
}

async function checkInexistentCardinality(
  relations: IRelation[],
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];

  relations.forEach((relation: IRelation) => {
    const { properties } = relation;
    const source = relation.getSource();
    const target = relation.getTarget();
    const sourceCardinality = properties[0].cardinality;
    const targetCardinality = properties[1].cardinality;

    if (!sourceCardinality) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_source_cardinality',
        title: 'Missing cardinality',
        detail: `Missing cardinality on the source end of relation "${relation.name}" between clasess "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }

    if (!targetCardinality) {
      preAnalysis.push({
        id: randomId(),
        code: 'inexistent_target_cardinality',
        title: 'Missing cardinality',
        detail: `Missing cardinality on the target end of relation "${relation.name}" between classes "${source.name}" and "${target.name}".`,
        meta: { element: relation },
      });
    }
  });

  return preAnalysis;
}

async function checkInexistentAttributesType(
  classes: IClass[],
): Promise<IPreAnalysisItem[]> {
  const preAnalysis: IPreAnalysisItem[] = [];

  classes.forEach((classElement: IClass) => {
    const { properties } = classElement;

    (properties || []).forEach((property: IProperty) => {
      const { name, propertyType } = property;

      if (!propertyType) {
        preAnalysis.push({
          id: randomId(),
          code: 'inexistent_attribute_type',
          title: 'Missing attribute type',
          detail: `Missing type on attribute "${name}" of class "${classElement.name}".`,
          meta: { element: classElement, property },
        });
      }
    });
  });

  return preAnalysis;
}