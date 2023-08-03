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
    const shape1 = diagram.addClass(class1).shape;

    shape1.id = 'sh1';
    shape1.width = 100;
    shape1.height = 80;
    shape1.setX(5);
    shape1.setY(10);

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/sh1> <rdf:type> <https://purl.org/ontouml-metamodel#Rectangle>');
  });

  it('should generate height triple', () => {
    expect(result).toContain('<http://test.com/sh1> <https://purl.org/ontouml-metamodel#height> "80"^^<xsd:positiveInteger>');
  });

  it('should generate width triple', () => {
    expect(result).toContain('<http://test.com/sh1> <https://purl.org/ontouml-metamodel#width> "100"^^<xsd:positiveInteger>');
  });

  it('should generate x coordinate triple', () => {
    expect(result).toContain('<https://purl.org/ontouml-metamodel#xCoordinate> "5"^^<http://www.w3.org/2001/XMLSchema#integer>');
  });

  it('should generate y coordinate triple', () => {
    expect(result).toContain('<https://purl.org/ontouml-metamodel#yCoordinate> "10"^^<http://www.w3.org/2001/XMLSchema#integer>');
  });
});
