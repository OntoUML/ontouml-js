import { OntologicalNature } from '@constants/.';
import { generateGufo } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('Classes', () => {
  it('should generate a label with the original name of the class', () => {
    const _class = OntoumlFactory.createKind('Happy Person');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:HappyPerson> <rdfs:label> "Happy Person"');
  });

  it('should generate a owl:Class and an owl:NamedIndividual', () => {
    const _class = OntoumlFactory.createKind('Person');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdf:type> <owl:Class>');
    expect(result).toContain('<:Person> <rdf:type> <owl:NamedIndividual>');
  });

  it('should transform «kind» class', () => {
    const _class = OntoumlFactory.createKind('Person');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Person> <rdfs:subClassOf> <gufo:FunctionalComplex>');
    expect(result).toContain('<:Person> <rdf:type> <gufo:Kind>');
  });

  it('should transform «collective» class { isExtensional=false }', () => {
    const _class = OntoumlFactory.createCollective('Group');
    _class.isExtensional = false;
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Group> <rdfs:subClassOf> <gufo:VariableCollection>');
    expect(result).toContain('<:Group> <rdf:type> <gufo:Kind>');
  });

  it('should transform «collective» class { isExtensional=true }', () => {
    const _class = OntoumlFactory.createCollective('FixedGroup');
    _class.isExtensional = true;
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:FixedGroup> <rdfs:subClassOf> <gufo:FixedCollection>');
    expect(result).toContain('<:FixedGroup> <rdf:type> <gufo:Kind>');
  });

  it('should transform «quantity» class', () => {
    const _class = OntoumlFactory.createQuantity('Wine');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Wine> <rdfs:subClassOf> <gufo:Quantity>');
    expect(result).toContain('<:Wine> <rdf:type> <gufo:Kind>');
  });

  it('should transform «relator» class', () => {
    const _class = OntoumlFactory.createRelator('Marriage');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Marriage> <rdfs:subClassOf> <gufo:Relator>');
    expect(result).toContain('<:Marriage> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[intrinsic-mode] }', () => {
    const _class = OntoumlFactory.createMode('Skill');
    _class.allowed = [OntologicalNature.intrinsic_mode];
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Skill> <rdfs:subClassOf> <gufo:IntrinsicMode>');
    expect(result).toContain('<:Skill> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[extrinsic-mode] }', () => {
    const _class = OntoumlFactory.createMode('Love');
    _class.allowed = [OntologicalNature.extrinsic_mode];
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Love> <rdfs:subClassOf> <gufo:ExtrinsicMode>');
    expect(result).toContain('<:Love> <rdf:type> <gufo:Kind>');
  });

  it('should transform «mode» class { allowed=[intrinsic-mode, extrinsic-mode] }', () => {
    const _class = OntoumlFactory.createMode('Belief');
    _class.allowed = [OntologicalNature.intrinsic_mode, OntologicalNature.extrinsic_mode];
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Belief> <rdfs:subClassOf> [');
    expect(result).toContain('<owl:unionOf> (<gufo:IntrinsicMode> <gufo:ExtrinsicMode>)');
    expect(result).toContain('<:Belief> <rdf:type> <gufo:Kind>');
  });

  it('should transform «role» class', () => {
    const _class = OntoumlFactory.createRole('Student');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Student> <rdf:type> <gufo:Role>');
  });

  it('should transform «phase» class', () => {
    const _class = OntoumlFactory.createPhase('Child');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Child> <rdf:type> <gufo:Phase>');
  });

  it('should transform «roleMixin» class', () => {
    const _class = OntoumlFactory.createRoleMixin('Customer');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Customer> <rdf:type> <gufo:RoleMixin>');
  });

  it('should transform «phaseMixin» class', () => {
    const _class = OntoumlFactory.createPhaseMixin('Infant');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Infant> <rdf:type> <gufo:PhaseMixin>');
  });

  it('should transform «mixin» class', () => {
    const _class = OntoumlFactory.createMixin('Seatable');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Seatable> <rdf:type> <gufo:Mixin>');
  });

  it('should transform «event» class', () => {
    const _class = OntoumlFactory.createEvent('Wedding');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Wedding> <rdfs:subClassOf> <gufo:Event>');
    expect(result).toContain('<:Wedding> <rdf:type> <gufo:EventType>');
  });

  it('should transform «situation» class', () => {
    const _class = OntoumlFactory.createSituation('Hazard');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Hazard> <rdfs:subClassOf> <gufo:Situation>');
    expect(result).toContain('<:Hazard> <rdf:type> <gufo:SituationType>');
  });

  it('should transform «abstract» class', () => {
    const _class = OntoumlFactory.createAbstract('Goal');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Goal> <rdfs:subClassOf> <gufo:AbstractIndividual>');
    expect(result).toContain('<:Goal> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should transform «datatype» class with attributes (complex datatype)', () => {
    const complexDatatype = OntoumlFactory.createDatatype('Date');
    const string = OntoumlFactory.createDatatype('String');
    OntoumlFactory.addAttribute(complexDatatype, 'day', string);
    OntoumlFactory.addAttribute(complexDatatype, 'month', string);
    OntoumlFactory.addAttribute(complexDatatype, 'year', string);
    const model = OntoumlFactory.createPackage(null, [complexDatatype, string]);
    const result = generateGufo(model);

    expect(result).toContain('<:Date> <rdfs:subClassOf> <gufo:QualityValue>');
    expect(result).toContain('<:Date> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should NOT transform «datatype» class without attributes (primitive datatype)', () => {
    const primitiveDatatype = OntoumlFactory.createDatatype('Date');
    const model = OntoumlFactory.createPackage(null, [primitiveDatatype]);
    const result = generateGufo(model);

    expect(result).not.toContain('<:Date> <rdfs:subClassOf> <gufo:QualityValue>');
    expect(result).not.toContain('<:Date> <rdf:type> <gufo:AbstractIndividualType>');
  });

  it('should transform «type» class', () => {
    const _class = OntoumlFactory.createType('Gender');
    const model = OntoumlFactory.createPackage(null, [_class]);
    const result = generateGufo(model);

    expect(result).toContain('<:Gender> <rdfs:subClassOf> <gufo:ConcreteIndividualType>');
  });
});
