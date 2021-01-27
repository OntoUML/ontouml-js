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
  ontouml2dbExample,
  referenceOntologyTrust,
  schoolTransportation
} from '@test-models/valids';
import { generateGufo, getIssues } from './helpers';
import { IPackage } from '@types';
import Options from '@libs/ontouml2gufo/options';

type File = {
  name: string;
  model: IPackage;
  options?: Partial<Options>;
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
          baseIri: 'https://alpinebits.org',
          createInverses: false,
          createObjectProperty: true
        }
      },
      {
        name: 'alpinebitsCustomLabel.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIri: 'https://alpinebits.org/custom',
          createInverses: true,
          customElementMapping: {
            JoK2ZeaGAqACBxS5: { uri: 'OWLPerson', label: { pt: 'Pessoa' } },
            Organization: { uri: 'OWLOrganization' },
            'Event Plan': { uri: 'OWLEventPlan' },
            '3x40WRaGAqCsIB4X': { uri: 'hasTrail', label: { en: 'hasLabel' } }
          }
        }
      },
      {
        name: 'alpinebitsHideRelations.ttl',
        model: alpinebits,
        options: {
          format: 'Turtle',
          baseIri: 'https://alpinebits.org/hide',
          createObjectProperty: false
        }
      },
      {
        name: 'alpinebits.nt',
        model: alpinebits,
        options: {
          baseIri: 'https://alpinebits.org/nt',
          createInverses: true,
          createObjectProperty: true
        }
      },
      {
        name: 'inverseRelations.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIri: 'https://relations.org/inverse',
          createInverses: true
        }
      },
      {
        name: 'inverseRelationsHideObjectProperty.ttl',
        model: inverseRelations,
        options: {
          format: 'Turtle',
          baseIri: 'https://relations.org/hide',
          createInverses: true,
          createObjectProperty: false
        }
      },
      {
        name: 'istandard.ttl',
        model: istandard,
        options: {
          format: 'Turtle',
          baseIri: 'https://istandaarden.nl'
        }
      },
      {
        name: 'istandard.nt',
        model: istandard
      },
      {
        name: 'istandardMultiplePackages.ttl',
        model: istandard,
        options: {
          format: 'Turtle',
          baseIri: 'https://istandaarden.nl',
          prefixPackages: true
        }
      },
      {
        name: 'person.ttl',
        model: person,
        options: { format: 'Turtle' }
      },
      {
        name: 'partWhole.ttl',
        model: partWhole,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/part-whole'
        }
      },
      {
        name: 'partWholeHideRelations.ttl',
        model: partWhole,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/part-whole/hide',
          createObjectProperty: false
        }
      },
      {
        name: 'partWhole.nt',
        model: partWhole,
        options: {
          baseIri: 'http://example.com/part-whole/nt'
        }
      },
      {
        name: 'annotations.ttl',
        model: annotations,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/annotations'
        }
      },
      {
        name: 'packagesMultiple.ttl',
        model: packages,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/package/multiple',
          prefixPackages: true
        }
      },
      {
        name: 'packagesSingle.ttl',
        model: packages,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/package/single'
        }
      },
      {
        name: 'derivation.ttl',
        model: derivation,
        options: {
          format: 'Turtle',
          baseIri: 'http://example.com/derivation'
        }
      },
      {
        name: 'preAnalysis.ttl',
        preAnalysisFile: 'preAnalysis.json',
        model: preAnalysis,
        options: {
          baseIri: '://foo/',
          createInverses: true,
          prefixPackages: true,
          customPackageMapping: {
            test: {
              prefix: 'test',
              uri: 'http://www.w3.org/2002/07/owl#'
            },
            'nQKxqY6D.AAAAQjF': {
              prefix: 'owl',
              uri: 'https://custom.com/owl#'
            }
          }
        }
      },
      {
        name: 'referenceOntologyTrust.ttl',
        model: referenceOntologyTrust,
        options: {
          baseIri: 'https://purl.org/krdb-core/rot',
          basePrefix: 'rot',
          format: 'Turtle',
          createObjectProperty: true,
          createInverses: false,
          prefixPackages: false
        }
      },
      {
        name: 'schoolTransportation.ttl',
        model: schoolTransportation,
        options: {
          baseIri: 'https://ontouml.org/example/school',
          basePrefix: 'school',
          format: 'Turtle',
          createObjectProperty: true,
          createInverses: false,
          prefixPackages: false
        }
      },
      {
        name: 'ontouml2dbExample.ttl',
        model: ontouml2dbExample,
        options: {
          baseIri: 'https://ontouml.org/example/ontouml2db',
          basePrefix: 'org',
          format: 'Turtle',
          createObjectProperty: true,
          createInverses: false,
          prefixPackages: false
        }
      }
    ];

    for (let file of files) {
      const path = '__tests__/libs/ontouml2gufo/examples/';

      const result = generateGufo(file.model, file.options);
      const modelFilepath = path + file.name;
      fs.writeFileSync(modelFilepath, result);

      if (file.preAnalysisFile) {
        const issues = getIssues(file.model, file.options);
        const analysisFilepath = path + file.preAnalysisFile;
        const jsonContent = JSON.stringify(issues, null, 2);
        fs.writeFileSync(analysisFilepath, jsonContent);
      }
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
