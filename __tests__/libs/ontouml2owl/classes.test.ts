import { OntologicalNature, Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Classes', () => {
  let result: string;

  beforeEach(() => {
    const project = new Project();
    const model = project.createModel();
    const clazz = model.createKind(null, { id: 'c1' });
    clazz.setName('Happy Person', 'en');
    clazz.setDescription('A person who is happy', 'en');
    clazz.isAbstract = true;
    clazz.isDerived = true;
    clazz.isPowertype = true;
    clazz.isExtensional = true;
    clazz.order = 2;
    clazz.createAttribute(clazz, null, { id: 'a1' });
    model.createKind(null, { id: '.c2.' });

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple', () => {
    expect(result).toContain('<http://test.com/c1> <rdf:type> <https://purl.org/ontouml-metamodel#Class>');
  });

  it('should handle special characters on class id', () => {
    expect(result).toContain('<http://test.com/.c2.> <rdf:type> <https://purl.org/ontouml-metamodel#Class>');
  });

  it('should generate stereotype triple', () => {
    expect(result).toContain(
      '<http://test.com/c1> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#kind>'
    );
  });

  it('should generate restrictedTo triple (functionalComplex)', () => {
    expect(result).toContain(
      '<http://test.com/c1> <https://purl.org/ontouml-metamodel#restrictedTo> <https://purl.org/ontouml-metamodel#functionalComplex>'
    );
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#name> "Happy Person"@en');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#description> "A person who is happy"@en');
  });

  it('should generate isAbstract triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#isAbstract> "true"^^<xsd:boolean>');
  });

  it('should generate isDerived triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#isDerived> "true"^^<xsd:boolean>');
  });

  it('should generate isPowertype triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#isPowertype> "true"^^<xsd:boolean>');
  });

  it('should generate isExtensional triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#isExtensional> "true"^^<xsd:boolean>');
  });

  it('should generate higher order triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#order> "2"^^<xsd:positiveInteger>');
  });

  it('should generate attribute triple', () => {
    expect(result).toContain('<http://test.com/c1> <https://purl.org/ontouml-metamodel#attribute> <http://test.com/a1>');
  });
});
