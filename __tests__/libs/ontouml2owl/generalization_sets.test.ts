import { Package, Project, Class, Generalization, GeneralizationSet } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Classes', () => {
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

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:gs1> <rdf:type> <ontouml:GeneralizationSet>');
  });

  it('should generate generalization triples', () => {
    expect(result).toContain('<t:gs1> <ontouml:generalization> <t:g1>');
    expect(result).toContain('<t:gs1> <ontouml:generalization> <t:g2>');
  });

  it('should generate categorizer triple', () => {
    expect(result).toContain('<t:gs1> <ontouml:categorizer> <t:c4>');
  });

  it('should generate isDisjoint triple', () => {
    expect(result).toContain('<t:gs1> <ontouml:isDisjoint> "true"^^<xsd:boolean>');
  });

  it('should generate isComplete triple', () => {
    expect(result).toContain('<t:gs1> <ontouml:isComplete> "true"^^<xsd:boolean>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<t:gs1> <ontouml:name> "status"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<t:gs1> <ontouml:description> "gs 1 description"@en');
  });
});
