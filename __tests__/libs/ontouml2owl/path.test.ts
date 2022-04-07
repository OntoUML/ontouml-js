import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

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
    const path1 = relView1.shape;

    path1.id = 'sh1';
    path1.moveTo(5, 10);
    path1.moveTo(15, 30);
    path1.moveTo(50, 100);

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/sh1> <https://purl.org/ontouml-metamodel#point>');
  });
});
