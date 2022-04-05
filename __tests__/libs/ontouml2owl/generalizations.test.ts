import { Package, Project, Class, Generalization } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Classes', () => {
  let project: Project;
  let model: Package;
  let parent, child: Class;
  let generalization: Generalization;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    parent = model.createKind(null, { id: 'c1' });
    child = model.createSubkind(null, null, { id: 'c2' });
    generalization = model.createGeneralization(parent, child, null, { id: 'g1' });
  });

  it('should generate rdf:type triple', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:g1> <rdf:type> <ontouml:Generalization>');
  });

  it('should generate name triple', () => {
    generalization.setName('gen 1', 'en');

    const result = generateOwl(project);
    expect(result).toContain('<t:g1> <ontouml:name> "gen 1"@en');
  });

  it('should generate description triple', () => {
    generalization.setDescription('gen 1 description', 'en');

    const result = generateOwl(project);
    expect(result).toContain('<t:g1> <ontouml:description> "gen 1 description"@en');
  });

  it('should generate general triple', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:g1> <ontouml:general> <t:c1>');
  });

  it('should generate specific triple', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:g1> <ontouml:specific> <t:c2>');
  });
});
