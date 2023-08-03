import { Package, Project, Class, Generalization, GeneralizationSet } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Generalization sets', () => {
  let project: Project;
  let model: Package;
  let parent, child1, child2, categorizer: Class;
  let gen1, gen2: Generalization;
  let gs: GeneralizationSet;
  let result: String;

  beforeAll(() => {
    project = new Project();
    model = project.createModel();
    parent = model.createKind(null, { id: 'c1' });
    child1 = model.createSubkind(null, null, { id: 'c2' });
    child2 = model.createSubkind(null, null, { id: 'c3' });
    categorizer = model.createType(null, { id: 'c4' });
    gen1 = model.createGeneralization(parent, child1, null, { id: 'g1' });
    gen2 = model.createGeneralization(parent, child2, null, { id: 'g2' });
    gs = model.createGeneralizationSet([gen1, gen2], true, true, categorizer, null, { id: 'gs1' });
    gs.setName('status', 'en');
    gs.setDescription('gs 1 description', 'en');

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/gs1> <rdf:type> <https://purl.org/ontouml-metamodel#GeneralizationSet>');
  });

  it('should generate generalization triples', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#generalization> <http://test.com/g1>');
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#generalization> <http://test.com/g2>');
  });

  it('should generate categorizer triple', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#categorizer> <http://test.com/c4>');
  });

  it('should generate isDisjoint triple', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#isDisjoint> "true"^^<xsd:boolean>');
  });

  it('should generate isComplete triple', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#isComplete> "true"^^<xsd:boolean>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#name> "status"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/gs1> <https://purl.org/ontouml-metamodel#description> "gs 1 description"@en');
  });
});
