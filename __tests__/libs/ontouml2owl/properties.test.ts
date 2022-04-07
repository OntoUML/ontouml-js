import { Property, Package, Project, Class, PropertyStereotype, AggregationKind } from '@libs/ontouml';
import { generateOwl } from './helpers';

const prefix = 't';
const baseUri = 'http://test.com/';

describe('Properties', () => {
  let project: Project;
  let model: Package;
  let clazz: Class;
  let attr: Property;
  let result: String;

  beforeAll(() => {
    project = new Project();
    model = project.createModel();
    clazz = model.createKind(null, { id: 'c1' });
    attr = clazz.createAttribute(clazz, null, { id: 'a1' });
    attr.stereotype = PropertyStereotype.BEGIN;
    attr.setName('amigo', 'pt');
    attr.setDescription('melhor amigo', 'pt');
    attr.isDerived = true;
    attr.isReadOnly = true;
    attr.aggregationKind = AggregationKind.COMPOSITE;
    attr.isOrdered = true;
    attr.cardinality.setOneToMany();

    result = generateOwl(project, baseUri, prefix);
  });

  it('should generate rdf:type triple (Property)', () => {
    expect(result).toContain('<http://test.com/a1> <rdf:type> <https://purl.org/ontouml-metamodel#Property>');
  });

  it('should generate propertyType triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#propertyType> <http://test.com/c1>');
  });

  it('should generate stereotype triple', () => {
    expect(result).toContain(
      '<http://test.com/a1> <https://purl.org/ontouml-metamodel#stereotype> <https://purl.org/ontouml-metamodel#begin>'
    );
  });

  it('should generate name triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#name> "amigo"@pt');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#description> "melhor amigo"@pt');
  });

  it('should generate isDerived triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#isDerived> "true"^^<xsd:boolean>');
  });

  it('should generate isReadOnly triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#isReadOnly> "true"^^<xsd:boolean>');
  });

  it('should generate aggregation kind triple', () => {
    expect(result).toContain(
      '<http://test.com/a1> <https://purl.org/ontouml-metamodel#aggregationKind> <https://purl.org/ontouml-metamodel#composite>'
    );
  });

  it('should generate isOrdered triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#isOrdered> "true"^^<xsd:boolean>');
  });

  it('should generate cardinality triple', () => {
    expect(result).toContain('<http://test.com/a1> <https://purl.org/ontouml-metamodel#cardinality> _:a1_cardinality');
  });

  it('should generate cardinality type triple', () => {
    expect(result).toContain('_:a1_cardinality <rdf:type> <https://purl.org/ontouml-metamodel#Cardinality>');
  });

  it('should generate cardinality value triple', () => {
    expect(result).toContain('_:a1_cardinality <https://purl.org/ontouml-metamodel#cardinalityValue> "1..*"');
  });

  it('should generate lower bound triple', () => {
    expect(result).toContain('_:a1_cardinality <https://purl.org/ontouml-metamodel#lowerBound> "1"');
  });

  it('should generate upper bound triple', () => {
    expect(result).toContain('_:a1_cardinality <https://purl.org/ontouml-metamodel#upperBound> "*"');
  });

  it('should generate subsets triple', () => {
    const attr2 = clazz.createAttribute(clazz, null, { id: 'a2' });
    attr2.subsettedProperties.push(attr);
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/a2> <https://purl.org/ontouml-metamodel#subsetsProperty> <http://test.com/a1>');
  });

  it('should generate redefines triple', () => {
    const attr2 = clazz.createAttribute(clazz, null, { id: 'a2' });
    attr2.redefinedProperties.push(attr);
    const result = generateOwl(project, baseUri, prefix);
    expect(result).toContain('<http://test.com/a2> <https://purl.org/ontouml-metamodel#redefinesProperty> <http://test.com/a1>');
  });
});
