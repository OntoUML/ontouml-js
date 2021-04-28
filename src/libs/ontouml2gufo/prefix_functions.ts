import { Package } from '@libs/ontouml';
import { Ontouml2Gufo, normalizeName } from './';

import _ from 'lodash';

export const DefaultPrefixes = {
  gufo: 'http://purl.org/nemo/gufo#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

export const getPrefixes = (ontouml2gufo: Ontouml2Gufo) => {
  return {
    ...getBasePrefix(ontouml2gufo),
    ...getPackagePrefixes(ontouml2gufo),
    ...DefaultPrefixes
  };
};

export const getBasePrefix = (ontouml2gufo: Ontouml2Gufo) => {
  const { baseIri, basePrefix } = ontouml2gufo.options;
  let prefix = {};

  if (basePrefix && basePrefix.trim().length > 0) {
    prefix[basePrefix] = `${baseIri}#`;
  } else {
    prefix[''] = `${baseIri}#`;
  }

  return prefix;
};

export const getPackagePrefixes = (ontouml2gufo: Ontouml2Gufo) => {
  if (!ontouml2gufo.options.prefixPackages) {
    return {};
  }

  const prefixes = {};
  const packages = ontouml2gufo.model.getAllPackages();

  for (const pkg of packages) {
    const prefix = getPackagePrefix(ontouml2gufo, pkg);
    const uri = getPackageUri(ontouml2gufo, pkg);
    prefixes[prefix] = uri;
  }

  return prefixes;
};

export const getPackagePrefix = (ontouml2gufo: Ontouml2Gufo, pkg: Package): string => {
  const customPrefix = ontouml2gufo.options.getCustomPackagePrefix(pkg);
  if (customPrefix) {
    return customPrefix;
  }

  if (ontouml2gufo.options.prefixPackages) {
    let prefix: string = normalizeName(pkg.getNameOrId());
    prefix = prefix.charAt(0).toLowerCase() + prefix.slice(1);
    return prefix;
  }

  return '';
};

export const getPackageUri = (ontouml2gufo: Ontouml2Gufo, pkg: Package): string => {
  const customUri = ontouml2gufo.options.getCustomPackageUri(pkg);
  if (customUri) {
    return customUri;
  }

  const { options } = ontouml2gufo;

  if (options.prefixPackages) {
    let uriSuffix: string = pkg.getName();
    uriSuffix = _.kebabCase(uriSuffix);

    return `${options.baseIri}/${uriSuffix}#`;
  }

  return '';
};
