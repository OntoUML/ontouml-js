import { Property, Package, Project, Class, PropertyStereotype, AggregationKind } from '@libs/ontouml';
import { generateOwl } from './helpers';

describe('Classes', () => {
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

    result = generateOwl(project);
  });

  it('should generate rdf:type triple (Property)', () => {
    expect(result).toContain('<t:a1> <rdf:type> <ontouml:Property>');
  });

  it('should generate propertyType triple', () => {
    expect(result).toContain('<t:a1> <ontouml:propertyType> <t:c1>');
  });

  it('should generate stereotype triple', () => {
    expect(result).toContain('<t:a1> <ontouml:stereotype> <ontouml:begin>');
  });

  it('should generate name triple', () => {
    expect(result).toContain('<t:a1> <ontouml:name> "amigo"@pt');
  });

  it('should generate description triple', () => {
    expect(result).toContain('<t:a1> <ontouml:description> "melhor amigo"@pt');
  });

  it('should generate isDerived triple', () => {
    expect(result).toContain('<t:a1> <ontouml:isDerived> "true"^^<xsd:boolean>');
  });

  it('should generate isReadOnly triple', () => {
    expect(result).toContain('<t:a1> <ontouml:isReadOnly> "true"^^<xsd:boolean>');
  });

  it('should generate aggregation kind triple', () => {
    expect(result).toContain('<t:a1> <ontouml:aggregationKind> <ontouml:composite>');
  });

  it('should generate isOrdered triple', () => {
    expect(result).toContain('<t:a1> <ontouml:isOrdered> "true"^^<xsd:boolean>');
  });

  it('should generate cardinality triple', () => {
    expect(result).toContain('<t:a1> <ontouml:cardinality> _:a1_cardinality');
  });

  it('should generate cardinality type triple', () => {
    expect(result).toContain('_:a1_cardinality <rdf:type> <ontouml:Cardinality>');
  });

  it('should generate cardinality value triple', () => {
    expect(result).toContain('_:a1_cardinality <ontouml:cardinalityValue> "1..*"');
  });

  it('should generate lower bound triple', () => {
    expect(result).toContain('_:a1_cardinality <ontouml:lowerBound> "1"');
  });

  it('should generate upper bound triple', () => {
    expect(result).toContain('_:a1_cardinality <ontouml:upperBound> "*"');
  });

  it('should generate subsets triple', () => {
    const attr2 = clazz.createAttribute(clazz, null, { id: 'a2' });
    attr2.subsettedProperties.push(attr);
    const result = generateOwl(project);
    expect(result).toContain('<t:a2> <ontouml:subsetsProperty> <t:a1>');
  });

  it('should generate redefines triple', () => {
    const attr2 = clazz.createAttribute(clazz, null, { id: 'a2' });
    attr2.redefinedProperties.push(attr);
    const result = generateOwl(project);
    expect(result).toContain('<t:a2> <ontouml:redefinesProperty> <t:a1>');
  });
});
