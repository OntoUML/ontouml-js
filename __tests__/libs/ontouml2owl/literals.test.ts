import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Properties', () => {
  let result: String;

  beforeAll(() => {
    const project = new Project();
    const model = project.createModel();
    const clazz = model.createEnumeration(null, null, { id: 'c1' });

    const lit1 = clazz.createLiteral(null, { id: 'l1' });
    lit1.setName('rojo', 'es');
    lit1.setDescription('el color rojo', 'es');
    clazz.createLiteral(null, { id: 'l2' });

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/l1> <rdf:type> <https://purl.org/ontouml-metamodel#Literal>');
  });

  it('should generate literal triples', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#literal> <http://test.com/l1>');
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#literal> <http://test.com/l2>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/l1> <https://purl.org/ontouml-metamodel#name> "rojo"@es');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/l1> <https://purl.org/ontouml-metamodel#description> "el color rojo"@es');
  });
});
