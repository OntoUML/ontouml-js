import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

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

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:l1> <rdf:type> <ontouml:Literal>');
  });

  it('should generate literal triples', () => {
    expect(result).toContain('<t:c1> <ontouml:literal> <t:l1>');
    expect(result).toContain('<t:c1> <ontouml:literal> <t:l2>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<t:l1> <ontouml:name> "rojo"@es');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<t:l1> <ontouml:description> "el color rojo"@es');
  });
});
