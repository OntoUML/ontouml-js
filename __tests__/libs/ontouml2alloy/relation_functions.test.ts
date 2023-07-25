import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';
import { generateAlloy, generateFact, generateFun, generateWorldFieldForClass, generateWorldFieldForRelation, generateWorldFact } from './helpers';
import { Class, ClassStereotype, Relation, Package, Project, Property, OntoumlType, AggregationKind, stereotypeUtils, OntologicalNature } from '@libs/ontouml';


describe('relation_functions', () => {

    let project: Project;
    let model: Package;
    let transformer: Ontouml2Alloy;

    beforeEach(() => {
        project = new Project();
        model = project.createModel();
    });

    it('should transform a relation between datatypes', () => {
        const sourceClass = model.createDatatype('Date');
        const targetClass = model.createDatatype('String');
        const relation = model.createBinaryRelation(sourceClass, targetClass);

        const result = generateAlloy(model);

        expect(result).toContain('sig Date in Datatype {\n        relation: String\n}');
    });

    it('should transform a material relation', () => {
        const class1 = model.createKind('Book');
        const class2 = model.createKind('Author');
        const relation = model.createMaterialRelation(class1, class2, 'writtenBy');
    
        const result = generateAlloy(model);
    
        expect(result).toContain('writtenBy: set Book set -> set Author');
    });

    it('should generate a World field for a derivation relation from material relation', () => {
        const organization = model.createKind('Organization');
        const employee = model.createRole('Employee');
        const employment = model.createRelator('Employment');
        const materialRelation = model.createMaterialRelation(organization, employee, 'hires');
        model.createMediationRelation(employment, organization);
        model.createMediationRelation(employment, employee);
        model.createDerivationRelation(materialRelation, employment);

        const result = generateAlloy(model);
        expect(result).toContain('hires: set Organization -> Employment -> Employee');
    });

    it('should generate a derivation fact for a derivation relation from material relation', () => {
        const organization = model.createKind('Organization');
        const employee = model.createRole('Employee');
        const employment = model.createRelator('Employment');
        const materialRelation = model.createMaterialRelation(organization, employee, 'hires');
        model.createMediationRelation(employment, organization);
        model.createMediationRelation(employment, employee);
        model.createDerivationRelation(materialRelation, employment);

        const result = generateAlloy(model);
        expect(result).toContain(generateFact('derivation',['all w: World, x: w.Organization, y: w.Employee, r: w.Employment | ','    x -> r -> y in w.hires iff x in r.(w.relation) and y in r.(w.relation1)']));
    });

    // //not handled but also not sure what's the expected output
    // it('derivation relation from comparative relation', () => {
    //     const organization = model.createKind('Organization');
    //     const employee = model.createRole('Employee');
    //     const employment = model.createRelator('Employment');
    //     const materialRelation = model.createComparativeRelation(organization, employee, 'hires');
    //     model.createCharacterizationRelation(employment, organization);
    //     model.createCharacterizationRelation(employment, employee);
    //     model.createDerivationRelation(materialRelation, employment);
        
    //     const result = generateAlloy(model);
    //     //there should be a fact containing this below
    //     "all w: World, x, y: w.Person | some x.(w.CHARACTERIZATION_RELATION_NAME) and some y.(w.CHARACTERIZATION_RELATION_NAME) implies (x in y.(w.COMPARATIVE_RELATION_NAME) or y in x.(w.COMPARATIVE_RELATION_NAME))"
    // })

    it('should generate World field for mediation relation', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
  
        model.createMediationRelation(class1, class2, 'involves');
        
        const result = generateAlloy(model);
    
        expect(result).toContain('involves: set Enrollment some -> one Student');
    });
    
    it('should generate relator constraint for mediation relation', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
  
        model.createMediationRelation(class1, class2, 'involves');
        
        const result = generateAlloy(model);
    
        expect(result).toContain(generateFact('relatorConstraint',['all w: World, x: w.Enrollment | #(Student1[x,w])>=2']));
    });
    
    it('should ensure mediation relation is acyclic', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
  
        model.createMediationRelation(class1, class2, 'involves');
        
        const result = generateAlloy(model);
    
        expect(result).toContain(generateFact('acyclic',['all w: World | acyclic[w.involves,w.Enrollment]']));
    });

    it('should generate relator rule for 2 mediation relations', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
        const class3 = model.createKind('University');

        const rel1 = model.createMediationRelation(class1, class2, 'involvesStudent');
        const rel2 = model.createMediationRelation(class1, class3, 'involvesUniveristy');
        
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('relatorConstraint',['all w: World, x: w.Enrollment | #(Student1[x,w]+University1[x,w])>=2']));
        
    });

    it('should transform a characterization relation', () => {
        const class1 = model.createExtrinsicMode('Love');
        const class2 = model.createKind('Person');
        model.createCharacterizationRelation(class1, class2, 'inside');

        const result = generateAlloy(model);

        expect(result).toContain('inside: set Love one -> one Person');
    });

 
    it('should generate a World field for a part-whole relation', () => {
        const wholeClass = model.createKind('Car');
        const partClass = model.createKind('Engine');
        const relation = model.createPartWholeRelation(wholeClass, partClass, 'hasEngine');

        const result = generateAlloy(model);

        expect(result).toContain(generateWorldFieldForRelation('hasEngine', 'Car', 'Engine', 'set', 'one'));
    });

    it('should generate an acyclic fact for a part-whole relation', () => {
        const wholeClass = model.createKind('Car');
        const partClass = model.createKind('Engine');
        const relation = model.createPartWholeRelation(wholeClass, partClass, 'hasEngine');

        const result = generateAlloy(model);

        expect(result).toContain(generateFact('acyclic',['all w: World | acyclic[w.hasEngine,w.Car]']));
    });

    it('should transform a reflexive relation', () => {
        const personClass = model.createKind('Person');
        const relation = model.createBinaryRelation(personClass, personClass, 'friend');
    
        const result = generateAlloy(model);
    
        expect(result).toContain('friend: set Person set -> set Person');
    });
    




});