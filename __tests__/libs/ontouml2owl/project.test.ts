import { Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Projects', () => {
  let result: string;

  beforeAll(() => {
    let project = new Project({ id: 'pj1' });
    project.setName('My project', 'en');
    project.setDescription('The best project ever', 'en');

    project.createModel({ id: 'pk1' });
    project.createDiagram({ id: 'dg1' });

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/pj1> <rdf:type> <https://purl.org/ontouml-metamodel#Project>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/pj1> <https://purl.org/ontouml-metamodel#name> "My project"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/pj1> <https://purl.org/ontouml-metamodel#description> "The best project ever"@en');
  });

  it('should generate model triple', () => {
    expect(result).toContain('<http://test.com/pj1> <https://purl.org/ontouml-metamodel#model> <http://test.com/pk1>');
  });

  it('should generate diagram triple', () => {
    expect(result).toContain('<http://test.com/pj1> <https://purl.org/ontouml-metamodel#diagram> <http://test.com/dg1>');
  });
});
