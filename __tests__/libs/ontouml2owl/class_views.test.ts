import { Project } from '@libs/ontouml';
import { generateOwl } from './helpers';

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

    result = generateOwl(project);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<t:cv1> <rdf:type> <ontouml:ClassView>');
  });

  it('should generate is view of triple', () => {
    expect(result).toContain('<t:cv1> <ontouml:isViewOf> <t:c1>');
  });

  it('should generate relation view content triple', () => {
    expect(result).toContain('<t:cv1> <ontouml:shape> <t:sh1>');
  });
});
