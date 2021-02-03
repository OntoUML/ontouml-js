import { generateGufo } from './helpers';
import { ClassStereotype, OntologicalNature, Package } from '@libs/ontouml';

describe('Classes', () => {
  it('should generate a label with the original name of the class', () => {
    const model = new Package();
    model.createKind('Happy Person');
    const result = generateGufo(model);

    expect(result).toContain('<:HappyPerson> <rdfs:label> "Happy Person"');
  });

  it('should generate a owl:Class and an owl:NamedIndividual', () => {
    const model = new Package();
    model.createKind('Person');
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdf:type> <owl:Class>');
    expect(result).toContain('<:Person> <rdf:type> <owl:NamedIndividual>');
  });

  it('should transform «kind» class', () => {
    const model = new Package();
    model.createKind('Person');
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:subClassOf> <gufo:FunctionalComplex>');
    expect(result).toContain('<:Person> <rdf:type> <gufo:Kind>');
  });

  it('should transform «collective» class { isExtensional=false }', () => {
    const model = new Package();
    model.createCollective('Group', false);
    const result = generateGufo(model);

    expect(result).toContain('<:Group> <rdfs:subClassOf> <gufo:VariableCollection>');
    expect(result).toContain('<:Group> <rdf:type> <gufo:Kind>');
  });

  it('should transform «collective» class { isExtensional=true }', () => {
    const model = new Package();
    model.createCollective('FixedGroup', true);
    const result = generateGufo(model);

    expect(result).toContain('<:FixedGroup> <rdfs:subClassOf> <gufo:FixedCollection>');
    expect(result).toContain('<:FixedGroup> <rdf:type> <gufo:Kind>');
  });

  it('should transform «quantity» class', () => {
    const model = new Package();
    model.createQuantity('Wine');
    const result = generateGufo(model);

    expect(result).toContain('<:Wine> <rdfs:subClassOf> <gufo:Quantity>');
    expect(result).toContain('<:Wine> <rdf:type> <gufo:Kind>');
  });

  it('should transform «relator» class', () => {
    const model = new Package();
    model.createRelator('Marriage');
    const result = generateGufo(model);

    expect(result).toContain('<:Marriage> <rdfs:subClassOf> <gufo:Relator>');
    expect(result).toContain('<:Marriage> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[intrinsic-mode] }', () => {
    const model = new Package();
    model.createIntrinsicMode('Skill');
    const result = generateGufo(model);

    expect(result).toContain('<:Skill> <rdfs:subClassOf> <gufo:IntrinsicMode>');
    expect(result).toContain('<:Skill> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[extrinsic-mode] }', () => {
    const model = new Package();
    model.createExtrinsicMode('Love');
    const result = generateGufo(model);

    expect(result).toContain('<:Love> <rdfs:subClassOf> <gufo:ExtrinsicMode>');
    expect(result).toContain('<:Love> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[intrinsic-mode, extrinsic-mode] }', () => {
    // const _class = OntoumlFactory.createMode('Belief');
    const model = new Package();
    model.createClass('Belief', ClassStereotype.MODE, [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode]);
    const result = generateGufo(model);

    expect(result).toContain('<:Belief> <rdfs:subClassOf> [');
    expect(result).toContain('<owl:unionOf> (<gufo:IntrinsicMode> <gufo:ExtrinsicMode>)');
    expect(result).toContain('<:Belief> <rdf:type> <gufo:Kind>');
  });

  it('should transform «role» class', () => {
    const model = new Package();
    model.createRole('Student');
    const result = generateGufo(model);

    expect(result).toContain('<:Student> <rdf:type> <gufo:Role>');
  });

  it('should transform «phase» class', () => {
    const model = new Package();
    model.createPhase('Child');
    const result = generateGufo(model);

    expect(result).toContain('<:Child> <rdf:type> <gufo:Phase>');
  });

  it('should transform «roleMixin» class', () => {
    const model = new Package();
    model.createRoleMixin('Customer');
    const result = generateGufo(model);

    expect(result).toContain('<:Customer> <rdf:type> <gufo:RoleMixin>');
  });

  it('should transform «phaseMixin» class', () => {
    const model = new Package();
    model.createPhaseMixin('Infant');
    const result = generateGufo(model);

    expect(result).toContain('<:Infant> <rdf:type> <gufo:PhaseMixin>');
  });

  it('should transform «mixin» class', () => {
    const model = new Package();
    model.createMixin('Seatable');
    const result = generateGufo(model);

    expect(result).toContain('<:Seatable> <rdf:type> <gufo:Mixin>');
  });

  it('should transform «event» class', () => {
    const model = new Package();
    model.createEvent('Wedding');
    const result = generateGufo(model);

    expect(result).toContain('<:Wedding> <rdfs:subClassOf> <gufo:Event>');
    expect(result).toContain('<:Wedding> <rdf:type> <gufo:EventType>');
  });

  it('should transform «situation» class', () => {
    const model = new Package();
    model.createSituation('Hazard');
    const result = generateGufo(model);

    expect(result).toContain('<:Hazard> <rdfs:subClassOf> <gufo:Situation>');
    expect(result).toContain('<:Hazard> <rdf:type> <gufo:SituationType>');
  });

  it('should transform «abstract» class', () => {
    const model = new Package();
    model.createAbstract('Goal');
    const result = generateGufo(model);

    expect(result).toContain('<:Goal> <rdfs:subClassOf> <gufo:AbstractIndividual>');
    expect(result).toContain('<:Goal> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should transform «datatype» class with attributes (complex datatype)', () => {
    const model = new Package();
    const _string = model.createDatatype('String');
    const complexDatatype = model.createDatatype('Date');
    complexDatatype.createAttribute(_string, 'day');
    complexDatatype.createAttribute(_string, 'month');
    complexDatatype.createAttribute(_string, 'year');
    const result = generateGufo(model);

    expect(result).toContain('<:Date> <rdfs:subClassOf> <gufo:QualityValue>');
    expect(result).toContain('<:Date> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should NOT transform «datatype» class without attributes (primitive datatype)', () => {
    const model = new Package();
    model.createDatatype('Date');
    const result = generateGufo(model);

    expect(result).not.toContain('<:Date> <rdfs:subClassOf> <gufo:QualityValue>');
    expect(result).not.toContain('<:Date> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should transform «type» class', () => {
    const model = new Package();
    model.createType('Gender');
    const result = generateGufo(model);

    expect(result).toContain('<:Gender> <rdfs:subClassOf> <gufo:ConcreteIndividualType>');
  });
});
