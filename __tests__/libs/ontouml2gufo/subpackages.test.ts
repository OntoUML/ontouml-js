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
      '@prefix person: <https://example.com/person#>.',
      '@prefix school: <https://example.com/school#>.',
      '@prefix job: <https://example.com/job#>.',
      '@prefix emptyPackage: <https://example.com/emptyPackage#>.',
      '@prefix duplicateNamePackage: <https://example.com/duplicateNamePackage#>.',
      '@prefix duplicateNamePackagezr3gi6gaqaccrgt: <https://example.com/duplicateNamePackagezr3gi6gaqaccrgt#>.',
      '@prefix universityJob: <https://example.com/universityJob#>.',
    ];

    for (const value of data) {
      expect(owlContent).toContain(value);
    }
  });

  it('should have elements with subpackage prefixes', () => {
    const data = [
      'person:Father rdf:type owl:Class',
      'school:Student rdf:type owl:Class',
      'job:Employee rdf:type owl:Class',
      'universityJob:Professor rdf:type owl:Class',
      'duplicateNamePackage:Ship rdf:type owl:Class',
      'duplicateNamePackagezr3gi6gaqaccrgt:Car rdf:type owl:Class',
    ];

    for (const value of data) {
      expect(owlContent).toContain(value);
    }
  });

  it('should generate custom subpackages prefixes', () => {
    const data = ['@prefix customPerson: <https://custom.com/person#>.', '@prefix customSchool: <https://custom.com/school#>.'];

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
