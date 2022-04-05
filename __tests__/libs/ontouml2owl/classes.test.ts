import { ClassStereotype, OntologicalNature, Package, Project, Class } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Classes', () => {
  let project: Project;
  let model: Package;
  let clazz: Class;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
    clazz = model.createKind(null, { id: 'c1' });
  });

  it('should generate rdf:type triple', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <rdf:type> <ontouml:Class>');
  });

  it('should generate stereotype triple', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:stereotype> <ontouml:kind>');
  });

  it('should generate restrictedTo triple (functionalComplex)', () => {
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:restrictedTo> <ontouml:functionalComplex>');
  });

  it('should generate restrictedTo triple (collective)', () => {
    clazz.restrictedTo = [OntologicalNature.collective];
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:restrictedTo> <ontouml:collective>');
  });

  it('should generate name triple', () => {
    clazz.setName('Happy Person', 'en');

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:name> "Happy Person"@en');
  });

  it('should generate description triple', () => {
    clazz.setDescription('A person who is happy', 'en');

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:description> "A person who is happy"@en');
  });

  it('should generate isAbstract triple', () => {
    clazz.isAbstract = true;

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:isAbstract> "true"^^<xsd:boolean>');
  });

  it('should generate isDerived triple', () => {
    clazz.isDerived = true;

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:isDerived> "true"^^<xsd:boolean>');
  });

  it('should generate isPowertype triple', () => {
    clazz.isPowertype = true;

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:isPowertype> "true"^^<xsd:boolean>');
  });

  it('should generate isExtensional triple', () => {
    clazz.isExtensional = true;

    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:isExtensional> "true"^^<xsd:boolean>');
  });

  it('should generate higher order triple', () => {
    clazz.order = 2;
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:order> "2"^^<xsd:positiveInteger>');
  });

  it('should generate attribute triple', () => {
    clazz.createAttribute(clazz, null, { id: 'a1' });
    const result = generateOwl(project);
    expect(result).toContain('<t:c1> <ontouml:attribute> <t:a1>');
  });
});
