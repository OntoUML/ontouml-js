import fs from 'fs';
import {
  annotations,
  alpinebits,
  istandard,
  person,
  partWhole,
  packages,
  derivation,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';
import { IPackage, IOntoUML2GUFOOptions } from '@types';

type File = {
  name: string;
  model: IPackage;
  options?: Partial<IOntoUML2GUFOOptions>;
};

describe('Examples', () => {
  beforeAll(async () => {
    const files: File[] = [
      {
        name: 'alpinebits.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIRI: 'https://alpinebits.org',
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
        model: partWhole,
        options: { format: 'Turtle' },
      },
      {
        name: 'partWholeHideRelations.ttl',
        model: partWhole,
        options: { format: 'Turtle', hideObjectPropertyCreation: true },
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
      const path = `__tests__/libs/ontuml2gufo/examples/${file.name}`;

      fs.writeFileSync(path, result);
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
