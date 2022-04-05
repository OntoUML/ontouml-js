import { Package, Project, Class, Relation } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Classes', () => {
  let project: Project;
  let model: Package;
  let class1, class2: Class;
  let result: string;

  beforeAll(() => {
    project = new Project();
    model = project.createModel({ id: 'pk1' });
    model.setName('Model', 'en');
    model.setDescription('The best model ever', 'en');

    class1 = model.createKind(null, { id: 'c1' });
    class2 = model.createSubkind(null, null, { id: 'c2' });
    model.createMaterialRelation(class1, class2, null, { id: 'r1' });
    model.createGeneralization(class1, class2, null, { id: 'g1' });

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:pk1> <rdf:type> <ontouml:Package>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:name> "Model"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:description> "The best model ever"@en');
  });

  it('should generate class1 content triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:containsModelElement> <t:c1>');
  });

  it('should generate class2 content triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:containsModelElement> <t:c2>');
  });

  it('should generate relation content triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:containsModelElement> <t:r1>');
  });

  it('should generate generalization content triple', () => {
    expect(result).toContain('<t:pk1> <ontouml:containsModelElement> <t:g1>');
  });
});
