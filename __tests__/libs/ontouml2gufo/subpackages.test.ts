import { packages } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Subpackages', () => {
  let owlContent;

  beforeAll(async () => {
    owlContent = await transformOntoUML2GUFO(packages, {
      format: 'Turtle',
      prefixPackages: true,
    });
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
      'duplicateNamePackage:MyClass rdf:type owl:Class',
      'duplicateNamePackagezr3gi6gaqaccrgt:MyOtherClass rdf:type owl:Class',
    ];

    for (const value of data) {
      expect(owlContent).toContain(value);
    }
  });
});
