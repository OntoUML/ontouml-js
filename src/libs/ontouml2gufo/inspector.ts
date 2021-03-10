import { ModelElement, Relation, Package, Class, Property } from '@libs/ontouml';
import { Ontouml2Gufo, Issue, DefaultPrefixes, getPackagePrefixes } from './';

import isURI from 'validate.io-uri';

export class Inspector {
  transformer: Ontouml2Gufo;
  issues: Issue[];

  constructor(transformer: Ontouml2Gufo) {
    this.issues = [];
    this.transformer = transformer;
  }

  /* 
  Pre-transformation issues to give users feedback about things that could potentially impact the transformation. Including:
  - Identify elements without name
  - Check invalid Base URI
  - Check package names prefixes that can clash with popular prefixes (rdfs, rdf, owl, etc)
  - Check repeated names (attributes, relation names and association ends, etc.)
  - Check relations without cardinality
  - Check attributes without type
  */
  run(): Issue[] {
    this.issues = [];

    this.checkBaseIri();
    this.checkPackagePrefixes();
    this.checkRelationNames();
    this.checkRepeatedNames();
    this.checkCardinality();
    this.checkAttributeType();

    return this.issues;
  }

  checkBaseIri() {
    const { baseIri } = this.transformer.options;

    if (!isURI(baseIri)) {
      this.issues.push(Issue.createInvalidBaseIri(baseIri));
    }
  }

  checkPackagePrefixes() {
    const packages = this.transformer.model.getAllPackages();

    const { customPackageMapping, prefixPackages } = this.transformer.options;
    const defaultPrefixKeys = Object.keys(DefaultPrefixes);
    const defaultPrefixUris = Object.values(DefaultPrefixes);

    for (const key of Object.keys(customPackageMapping)) {
      const packageEl = packages.find(({ id, name }: Package) => id === key || name.getText() === key) || {
        id: '',
        name: ''
      };
      const { prefix, uri } = customPackageMapping[key];

      if (defaultPrefixKeys.includes(prefix)) {
        const issue = Issue.createInvalidCustomPackagePrefix(prefix, defaultPrefixKeys, packageEl);
        this.issues.push(issue);
      }

      if (defaultPrefixUris.includes(uri)) {
        const issue = Issue.createInvalidCustomPackageUri(uri, packageEl);
        this.issues.push(issue);
      }
    }

    if (prefixPackages) {
      const prefixes = getPackagePrefixes(this.transformer);

      for (const prefix of Object.keys(prefixes)) {
        const uri = prefixes[prefix];

        if (defaultPrefixKeys.includes(prefix)) {
          const issue = Issue.createInvalidPackagePrefix(prefix, defaultPrefixKeys);
          this.issues.push(issue);
        }

        if (defaultPrefixUris.includes(uri)) {
          const issue = Issue.createInvalidPackageUri(uri);
          this.issues.push(issue);
        }
      }
    }
  }

  checkRelationNames() {
    const relations = this.transformer.model.getAllRelations();

    relations.forEach((relation: Relation) => {
      const sourceAssociationName = relation.properties[0].getName();
      const targetAssociationName = relation.properties[1].getName();

      if (!relation.getName() && !targetAssociationName) {
        const issue = Issue.createMissingRelationName(relation);
        this.issues.push(issue);
      }

      if (this.transformer.options.createInverses && !sourceAssociationName) {
        const issue = Issue.createMissingInverseRelationName(relation);
        this.issues.push(issue);
      }
    });
  }

  checkRepeatedNames() {
    const elements = this.transformer.model.getAllContents();
    const elementNames = {};

    elements.forEach((element: ModelElement) => {
      const name = element.getName();

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
        const issue = Issue.createDuplicateNames(repeatedElements, name);
        this.issues.push(issue);
      }
    }
  }

  checkCardinality() {
    const relations = this.transformer.model.getAllRelations();

    relations.forEach((relation: Relation) => {
      const { properties } = relation;
      const sourceCardinality = properties[0].cardinality;
      const targetCardinality = properties[1].cardinality;

      if (!sourceCardinality) {
        const issue = Issue.createMissingSourceCardinality(relation);
        this.issues.push(issue);
      }

      if (!targetCardinality) {
        const issue = Issue.createMissingTargetCardinality(relation);
        this.issues.push(issue);
      }
    });
  }

  checkAttributeType() {
    const classes = this.transformer.model.getAllClasses();

    classes.forEach((classEl: Class) => {
      (classEl.properties || []).forEach((attribute: Property) => {
        if (!attribute.propertyType) {
          const issue = Issue.createMissingAttributeType(classEl, attribute);
          this.issues.push(issue);
        }
      });
    });
  }
}
