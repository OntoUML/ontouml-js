import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Class views', () => {
  let result: string;

  beforeAll(() => {
    const project = new Project();

    const model = project.createModel({ id: 'pk1' });
    const class1 = model.createKind(null, { id: 'c1' });

    const diagram = project.createDiagram({ id: 'd1' });
    const classView1 = diagram.addClass(class1);
    classView1.id = 'cv1';
    classView1.shape.id = 'sh1';

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/cv1> <rdf:type> <https://purl.org/ontouml-metamodel#ClassView>');
  });

  it('should generate is view of triple', () => {
    expect(result).toContain('<http://test.com/cv1> <https://purl.org/ontouml-metamodel#isViewOf> <http://test.com/c1>');
  });

  it('should generate relation view content triple', () => {
    expect(result).toContain('<http://test.com/cv1> <https://purl.org/ontouml-metamodel#shape> <http://test.com/sh1>');
  });
});
