import { Package, Project, Class, Relation } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Relations', () => {
  let project: Project;
  let model: Package;
  let clazz: Class;
  let relation: Relation;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    clazz = model.createKind(null, { id: 'c1' });
    relation = model.createMaterialRelation(clazz, clazz, null, { id: 'r1' });
  });

  it('should generate rdf:type triple', () => {
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <rdf:type> <https://purl.org/ontouml-metamodel#Relation>');
  });

  it('should generate stereotype triple', () => {
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain(
      '<http://test.com/r1> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#material>'
    );
  });

  it('should generate name triple', () => {
    relation.setName('amico di', 'it');
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <https://purl.org/ontouml-metamodel#name> "amico di"@it');
  });

  it('should generate description triple', () => {
    relation.setDescription('gli amici', 'it');
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <https://purl.org/ontouml-metamodel#description> "gli amici"@it');
  });

  it('should generate isDerived triple', () => {
    relation.isDerived = true;
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <https://purl.org/ontouml-metamodel#isDerived> "true"^^<xsd:boolean>');
  });

  it('should generate sourceEnd triple', () => {
    relation.getSourceEnd().id = 'p1';
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <https://purl.org/ontouml-metamodel#sourceEnd> <http://test.com/p1>');
  });

  it('should generate targetEnd triple', () => {
    relation.getTargetEnd().id = 'p2';
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r1> <https://purl.org/ontouml-metamodel#targetEnd> <http://test.com/p2>');
  });

  it('should generate relationEnd triples for n-ary relations', () => {
    const ternary = model.createTernaryRelation([clazz, clazz, clazz], null, { id: 'r2' });
    ternary.properties[0].id = 'p1';
    ternary.properties[1].id = 'p2';
    ternary.properties[2].id = 'p3';
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/r2> <https://purl.org/ontouml-metamodel#relationEnd> <http://test.com/p1>');
    expect(result).toContain('<http://test.com/r2> <https://purl.org/ontouml-metamodel#relationEnd> <http://test.com/p2>');
    expect(result).toContain('<http://test.com/r2> <https://purl.org/ontouml-metamodel#relationEnd> <http://test.com/p3>');
  });
});
