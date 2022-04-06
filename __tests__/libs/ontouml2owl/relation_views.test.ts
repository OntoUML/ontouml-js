import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Relation views', () => {
  let result: string;

  beforeAll(() => {
    const project = new Project();

    const model = project.createModel({ id: 'pk1' });
    const class1 = model.createKind(null, { id: 'c1' });
    const class2 = model.createSubkind(null, null, { id: 'c2' });
    const rel1 = model.createMaterialRelation(class1, class2, null, { id: 'r1' });

    const diagram = project.createDiagram({ id: 'd1' });
    const relView1 = diagram.addBinaryRelation(rel1);
    relView1.id = 'rv1';
    relView1.shape.id = 'sh1';
    relView1.source.id = 'cv1';
    relView1.target.id = 'cv2';

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:rv1> <rdf:type> <ontouml:RelationView>');
  });

  it('should generate "is view of" triple', () => {
    expect(result).toContain('<t:rv1> <ontouml:isViewOf> <t:r1>');
  });

  it('should generate shape triple', () => {
    expect(result).toContain('<t:rv1> <ontouml:shape> <t:sh1>');
  });

  it('should generate source view triple', () => {
    expect(result).toContain('<t:rv1> <ontouml:sourceView> <t:cv1>');
  });

  it('should generate target view triple', () => {
    expect(result).toContain('<t:rv1> <ontouml:targetView> <t:cv2>');
  });
});
