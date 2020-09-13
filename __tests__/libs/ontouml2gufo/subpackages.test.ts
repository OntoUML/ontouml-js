import { packages } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Subpackages', () => {
  let owlContent;
  let customPackages;

  beforeAll(async () => {
    owlContent = (await transformOntoUML2GUFO(packages, {
      format: 'Turtle',
      prefixPackages: true,
    })).model;

    customPackages = (await transformOntoUML2GUFO(packages, {
      format: 'Turtle',
      customPackageMapping: {
        ZPFjgI6GAqACCQyA: {
          prefix: 'customPerson',
          uri: 'https://custom.com/person#',
        },
        School: {
          prefix: 'customSchool',
          uri: 'https://custom.com/school#',
        },
      },
    })).model;
  });

  it('should generate subpackages prefixes', () => {
    const data = [
      '@prefix Person: <https://example.com/Person#>.',
      '@prefix School: <https://example.com/School#>.',
      '@prefix Job: <https://example.com/Job#>.',
      '@prefix EmptyPackage: <https://example.com/EmptyPackage#>.',
      '@prefix DuplicateNamePackage: <https://example.com/DuplicateNamePackage#>.',
      '@prefix DuplicateNamePackage_zR3gI6GAqACCRGT: <https://example.com/DuplicateNamePackage_zR3gI6GAqACCRGT#>.',
      '@prefix UniversityJob: <https://example.com/UniversityJob#>.',
    ];

    for (const value of data) {
      expect(owlContent).toContain(value);
    }
  });

  it('should have elements with subpackage prefixes', () => {
    const data = [
      'Person:Father rdf:type owl:Class',
      'School:Student rdf:type owl:Class',
      'Job:Employee rdf:type owl:Class',
      'UniversityJob:Professor rdf:type owl:Class',
      'DuplicateNamePackage:Ship rdf:type owl:Class',
      'DuplicateNamePackage_zR3gI6GAqACCRGT:Car rdf:type owl:Class',
    ];

    for (const value of data) {
      expect(owlContent).toContain(value);
    }
  });

  it('should generate custom subpackages prefixes', () => {
    const data = [
      '@prefix customPerson: <https://custom.com/person#>.',
      '@prefix customSchool: <https://custom.com/school#>.',
    ];

    for (const value of data) {
      expect(customPackages).toContain(value);
    }
  });

  it('should have elements with custom subpackage prefixes', () => {
    const data = ['customPerson:Father rdf:type owl:Class', 'customSchool:Student rdf:type owl:Class'];

    for (const value of data) {
      expect(customPackages).toContain(value);
    }
  });
});
