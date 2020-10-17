import memoizee from 'memoizee';
import { IPackage } from '@types';
import { getAllPackages, getName } from './helper_functions';
import Options from './options';
import { normalizeName } from './uri_manager';
import _ from 'lodash';

export const DefaultPrefixes = {
  gufo: 'http://purl.org/nemo/gufo#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

export const getPrefixes = (model: IPackage, options: Options) => {
  let prefixes = [];
  prefixes = {
    ...getBasePrefix(options),
    ...getPackagePrefixes(model, options),
    ...DefaultPrefixes
  };

  return prefixes;
};

export const getBasePrefix = memoizee((options: Options) => {
  const { baseIri, basePrefix } = options;
  let prefix = {};

  if (basePrefix && basePrefix.trim().length > 0) {
    prefix[basePrefix] = `${baseIri}#`;
  } else {
    prefix[''] = `${baseIri}#`;
  }

  return prefix;
});

export const getPackagePrefixes = memoizee((model: IPackage, options: Options) => {
  const packages = getAllPackages(model);
  const prefixes = {};

  if (!options.prefixPackages) return prefixes;

  for (const pkg of packages) {
    const prefix = getPackagePrefix(pkg, options);
    const uri = getPackageUri(pkg, options);
    prefixes[prefix] = uri;
  }

  return prefixes;
});

export const getPackagePrefix = memoizee((pkg: IPackage, options: Options): string => {
  const { customPrefix } = getCustomPackageData(pkg, options);

  if (customPrefix) {
    return customPrefix;
  }

  if (options.prefixPackages) {
    let prefix: string = normalizeName(getName(pkg));
    prefix = prefix.charAt(0).toLowerCase() + prefix.slice(1);
    return prefix;
  }

  return '';
});

export const getPackageUri = memoizee((pkg: IPackage, options: Options): string => {
  const { customUri } = getCustomPackageData(pkg, options);

  if (customUri) {
    return customUri;
  }

  if (options.prefixPackages) {
    let uriSuffix: string = getName(pkg);
    uriSuffix = _.kebabCase(uriSuffix);

    return `${options.baseIri}/${uriSuffix}#`;
  }

  return '';
});

type CustomPrefixData = { customPrefix?: string; customUri: string };

export const getCustomPackageData = (pkg: IPackage, options: Options): CustomPrefixData => {
  const id = pkg.id;
  const name = getName(pkg);

  const { customPackageMapping } = options;
  let customPrefix;
  let customUri;

  if (customPackageMapping[id]) {
    customPrefix = customPackageMapping[id].prefix;
    customUri = customPackageMapping[id].uri;
  } else if (customPackageMapping[name]) {
    customPrefix = customPackageMapping[name].prefix;
    customUri = customPackageMapping[name].uri;
  }

  return { customPrefix, customUri };
};
