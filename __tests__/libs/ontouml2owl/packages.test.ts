import { Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Packages', () => {
  let model: Package;
  let result: string;

  beforeAll(() => {
    let project = new Project();
    model = project.createModel({ id: 'pk1' });
    model.setName('Model', 'en');
    model.setDescription('The best model ever', 'en');

    let class1 = model.createKind(null, { id: 'c1' });
    let class2 = model.createSubkind(null, null, { id: 'c2' });
    model.createMaterialRelation(class1, class2, null, { id: 'r1' });
    model.createGeneralization(class1, class2, null, { id: 'g1' });

    let pk2 = model.createPackage(null, { id: 'pk2' });
    pk2.createKind(null, { id: 'c3' });

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/pk1> <rdf:type> <https://purl.org/ontouml-metamodel#Package>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/pk1> <https://purl.org/ontouml-metamodel#name> "Model"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/pk1> <https://purl.org/ontouml-metamodel#description> "The best model ever"@en');
  });

  it('should generate class1 content triple', () => {
    expect(result).toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/c1>'
    );
  });

  it('should generate class2 content triple', () => {
    expect(result).toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/c2>'
    );
  });

  it('should generate relation content triple', () => {
    expect(result).toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/r1>'
    );
  });

  it('should generate generalization content triple', () => {
    expect(result).toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/g1>'
    );
  });

  it('should generate package content triple', () => {
    expect(result).toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/pk2>'
    );
  });

  it('should NOT generate content triple for class of a subpackage', () => {
    expect(result).not.toContain(
      '<http://test.com/pk1> <https://purl.org/ontouml-metamodel#containsModelElement> <http://test.com/c3>'
    );
  });
});
