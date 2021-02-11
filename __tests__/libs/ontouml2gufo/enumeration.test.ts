import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Enumeration', () => {
  let result;

  beforeAll(async () => {
    const model = new Package();
    const _class = model.createEnumeration('Color');

    _class.createLiteral('blue');
    _class.createLiteral('red');
    _class.createLiteral('green');

    result = generateGufo(model);
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
