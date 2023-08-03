import { Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Diagrams', () => {
  let model: Package;
  let result: string;

  beforeAll(() => {
    let project = new Project();

    model = project.createModel({ id: 'pk1' });
    const class1 = model.createKind(null, { id: 'c1' });
    const class2 = model.createSubkind(null, null, { id: 'c2' });
    const class3 = model.createSubkind(null, null, { id: 'c3' });
    const rel1 = model.createMaterialRelation(class1, class2, null, { id: 'r1' });
    const gen1 = model.createGeneralization(class1, class2, null, { id: 'g1' });
    const gen2 = model.createGeneralization(class1, class3, null, { id: 'g2' });
    const gs1 = model.createGeneralizationSet([gen1, gen2], true, true, null, null, { id: 'gs1' });

    const diagram = project.createDiagram({ id: 'd1' });
    diagram.setName('My diagram', 'en');
    diagram.setDescription('The best diagram ever', 'en');

    const pkgView1 = diagram.addPackage(model);
    pkgView1.id = 'pv1';

    const classView1 = diagram.addClass(class1);
    classView1.id = 'cv1';

    const classView2 = diagram.addClass(class2);
    classView2.id = 'cv2';

    const classView3 = diagram.addClass(class3);
    classView3.id = 'cv3';

    const relationView = diagram.addBinaryRelation(rel1);
    relationView.id = 'rv1';

    const genView1 = diagram.addGeneralization(gen1);
    genView1.id = 'gv1';

    const genView2 = diagram.addGeneralization(gen2);
    genView2.id = 'gv2';

    const gsView = diagram.addGeneralizationSet(gs1);
    gsView.id = 'gsv1';

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/d1> <rdf:type> <https://purl.org/ontouml-metamodel#Diagram>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#name> "My diagram"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#description> "The best diagram ever"@en');
  });

  it('should generate class view contents triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/cv1>');
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/cv2>');
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/cv3>');
  });

  it('should generate relation view content triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/rv1>');
  });

  it('should generate generalization view contents triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/gv1>');
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/gv2>');
  });

  it('should generate generalization set view content triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/gsv1>');
  });

  it('should generate package view content triple', () => {
    expect(result).toContain('<http://test.com/d1> <https://purl.org/ontouml-metamodel#containsView> <http://test.com/pv1>');
  });
});
