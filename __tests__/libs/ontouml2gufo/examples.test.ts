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
  preAnalysis,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';
import { IPackage, IOntoUML2GUFOOptions } from '@types';

type File = {
  name: string;
  model: IPackage;
  options?: Partial<IOntoUML2GUFOOptions>;
  preAnalysisFile?: string;
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
          createInverses: false,
          createObjectProperty: true,
        },
      },
      {
        name: 'alpinebitsCustomLabel.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIRI: 'https://alpinebits.org/custom',
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
          baseIRI: 'https://alpinebits.org/hide',
          createObjectProperty: false,
        },
      },
      {
        name: 'alpinebits.nt',
        model: alpinebits,
        options: {
          baseIRI: 'https://alpinebits.org/nt',
          createInverses: true,
          createObjectProperty: true,
        },
      },
      {
        name: 'inverseRelations.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIRI: 'https://relations.org/inverse',
          createInverses: true,
        },
      },
      {
        name: 'inverseRelationsHideObjectProperty.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIRI: 'https://relations.org/hide',
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
        model: partWhole,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/part-whole',
        },
      },
      {
        name: 'partWholeHideRelations.ttl',
        model: partWhole,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/part-whole/hide',
          createObjectProperty: false,
        },
      },
      {
        name: 'partWhole.nt',
        model: partWhole,
        options: {
          baseIRI: 'http://example.com/part-whole/nt',
        },
      },
      {
        name: 'annotations.ttl',
        model: annotations,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/annotations',
        },
      },
      {
        name: 'packagesMultiple.ttl',
        model: packages,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/package/multiple',
          prefixPackages: true,
        },
      },
      {
        name: 'packagesSingle.ttl',
        model: packages,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/package/single',
        },
      },
      {
        name: 'derivation.ttl',
        model: derivation,
        options: {
          format: 'Turtle',
          baseIRI: 'http://example.com/derivation',
        },
      },
      {
        name: 'preAnalysis.ttl',
        preAnalysisFile: 'preAnalysis.json',
        model: preAnalysis,
        options: {
          baseIRI: '://foo/',
          createInverses: true,
          preAnalysis: true,
          prefixPackages: true,
          customPackageMapping: {
            test: {
              prefix: 'test',
              uri: 'http://www.w3.org/2002/07/owl#',
            },
            'nQKxqY6D.AAAAQjF': {
              prefix: 'owl',
              uri: 'https://custom.com/owl#',
            },
          },
        },
      },
    ];

    for (let file of files) {
      const path = '__tests__/libs/ontouml2gufo/examples/';

      const result = await transformOntoUML2GUFO(file.model, file.options);
      const modelFilepath = path + file.name;
      fs.writeFileSync(modelFilepath, result.model);

      if (file.preAnalysisFile) {
        const analysisFilepath = path + file.preAnalysisFile;
        const jsonContent = JSON.stringify(result.preAnalysis, null, 2);
        fs.writeFileSync(analysisFilepath, jsonContent);
      }
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
