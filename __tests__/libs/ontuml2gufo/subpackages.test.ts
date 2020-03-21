import { istandard } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Subpackages', () => {
  let istandardResult;

  beforeAll(async () => {
    istandardResult = await transformOntoUML2GUFO(istandard, {
      format: 'Turtle',
      prefixPackages: true,
    });
  });

  it('should generate subpackages prefixes', () => {
    const data = [
      '@prefix processModel: <https://example.com/processModel#>.',
      '@prefix ontology: <https://example.com/ontology#>.',
      '@prefix core: <https://example.com/core#>.',
      '@prefix wlzLongTermCare: <https://example.com/wlzLongTermCare#>.',
      '@prefix package: <https://example.com/package#>.',
      '@prefix 1Request: <https://example.com/1Request#>.',
      '@prefix 2Indication: <https://example.com/2Indication#>.',
      '@prefix 3Allocation: <https://example.com/3Allocation#>.',
      '@prefix 4ServiceAgreement: <https://example.com/4ServiceAgreement#>.',
      '@prefix 6TransferMoving: <https://example.com/6TransferMoving#>.',
      '@prefix 0WlzRight: <https://example.com/0WlzRight#>.',
      '@prefix preference: <https://example.com/preference#>.',
      '@prefix 0LthClient: <https://example.com/0LthClient#>.',
      '@prefix 5ServiceDelivery: <https://example.com/5ServiceDelivery#>.',
      '@prefix 7HealthcareServicePackage: <https://example.com/7HealthcareServicePackage#>.',
    ];

    for (const value of data) {
      expect(istandardResult).toContain(value);
    }
  });

  it('should have elements with subpackage prefixes', () => {
    const data = [
      'core:Person rdf:type owl:Class,',
      '1Request:LtcRequest rdf:type owl:Class',
      'preference:CareLocationType rdf:type owl:Class',
      '7HealthcareServicePackage:AllocatedHealthcareServicePackage rdf:type owl:Class',
    ];

    for (const value of data) {
      expect(istandardResult).toContain(value);
    }
  });
});
