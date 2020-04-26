import fs from 'fs';
import {
  annotations,
  alpinebits,
  istandard,
  person,
  partWhole,
  packages,
  derivation,
  inverseRelations,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';
import { IPackage, IOntoUML2GUFOOptions } from '@types';

type File = {
  name: string;
  docName?: string;
  model: IPackage;
  options?: Partial<IOntoUML2GUFOOptions>;
};

describe('Examples', () => {
  beforeAll(async () => {
    const files: File[] = [
      {
        name: 'alpinebits.ttl',
        docName: 'alpinebits.html',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIRI: 'https://alpinebits.org',
          createDocumentation: true,
          createObjectProperty: false,
        },
      },
      {
        name: 'alpinebitsCustomLabel.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIRI: 'https://alpinebits.org',
          createInverses: true,
          customElementMapping: {
            JoK2ZeaGAqACBxS5: { uri: 'OWLPerson', label: { pt: 'Pessoa' } },
            Organization: { uri: 'OWLOrganization' },
            'Event Plan': { uri: 'OWLEventPlan' },
            '3x40WRaGAqCsIB4X': { uri: 'hasTrail', label: { en: 'hasLabel' } },
          },
        },
      },
      {
        name: 'alpinebitsHideRelations.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIRI: 'https://alpinebits.org',
          createObjectProperty: false,
        },
      },
      {
        name: 'alpinebits.nt',
        model: alpinebits,
        options: {
          baseIRI: 'https://alpinebits.org',
        },
      },
      {
        name: 'inverseRelations.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIRI: 'https://relations.org',
          createInverses: true,
        },
      },
      {
        name: 'inverseRelationsHideObjectProperty.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIRI: 'https://relations.org',
          createInverses: true,
          createObjectProperty: false,
        },
      },
      {
        name: 'istandard.ttl',
        model: istandard,
        options: {
          format: 'Turtle',
          baseIRI: 'https://istandaarden.nl',
        },
      },
      {
        name: 'istandard.nt',
        model: istandard,
      },
      {
        name: 'istandardMultiplePackages.ttl',
        model: istandard,
        options: {
          format: 'Turtle',
          baseIRI: 'https://istandaarden.nl',
          prefixPackages: true,
        },
      },
      {
        name: 'person.ttl',
        model: person,
        options: { format: 'Turtle' },
      },
      {
        name: 'partWhole.ttl',
        docName: 'partWhole.html',
        model: partWhole,
        options: { format: 'Turtle', createDocumentation: true },
      },
      {
        name: 'partWholeHideRelations.ttl',
        model: partWhole,
        options: { format: 'Turtle', createObjectProperty: false },
      },
      {
        name: 'partWhole.nt',
        model: partWhole,
      },
      {
        name: 'annotations.ttl',
        model: annotations,
        options: { format: 'Turtle' },
      },
      {
        name: 'annotations.ttl',
        model: annotations,
        options: { format: 'Turtle' },
      },
      {
        name: 'packagesMultiple.ttl',
        model: packages,
        options: { format: 'Turtle', prefixPackages: true },
      },
      {
        name: 'packagesSingle.ttl',
        model: packages,
        options: { format: 'Turtle' },
      },
      {
        name: 'derivation.ttl',
        model: derivation,
        options: { format: 'Turtle' },
      },
    ];

    for (let file of files) {
      const result = await transformOntoUML2GUFO(file.model, file.options);
      const path = `__tests__/libs/ontouml2gufo/examples/${file.name}`;

      if (file.options && file.options.createDocumentation && file.docName) {
        const docPath = `__tests__/libs/ontouml2gufo/examples/${file.docName}`;
        fs.writeFileSync(docPath, result.documentation);
      }

      fs.writeFileSync(path, result.model);
    }
  });

  it('should generate example files', () => {
    expect(true).toBe(true);
  });
});
