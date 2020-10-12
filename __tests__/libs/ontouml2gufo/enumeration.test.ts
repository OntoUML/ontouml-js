import { OntoumlFactory, generateGufo } from './helpers';

describe('Enumeration', () => {
  let result;

  beforeAll(async () => {
    const _class = OntoumlFactory.createEnumeration('Color', ['blue', 'red', 'green']);
    const model = OntoumlFactory.createPackage(null, [_class]);
    result = generateGufo(model)
  });

  it('should transform «enumeration» class', async () => {
    expect(result).toContain('<:Color> <rdfs:subClassOf> <gufo:QualityValue>');
    expect(result).toContain('<:Color> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should create equivalentClass with literals', async () => {
    expect(result).toContain('<:Color> <owl:equivalentClass>');
    expect(result).toContain('<owl:oneOf> (<:blue> <:red> <:green>)');
  });

  it('should transform literals', async () => {
    expect(result).toContain('<:blue> <rdf:type> <:Color> .');
    expect(result).toContain('<:red> <rdf:type> <:Color> .');
    expect(result).toContain('<:green> <rdf:type> <:Color> .');
  });
});
