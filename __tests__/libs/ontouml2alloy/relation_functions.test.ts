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

    //cardinality under question
    it('should transform a relation between datatypes', () => {
        const sourceClass = model.createDatatype('Date');
        const targetClass = model.createDatatype('String');
        const relation = model.createBinaryRelation(sourceClass, targetClass);

        const result = generateAlloy(model);

        console.log(result);
        expect(result).toContain('sig Date in Datatype {\n         relation1: String\n}');
        expect(result).toContain(generateFact('datatypesMultiplicity',['all x: Date | #x.relation1>=0','all x: String | #relation1.x>=0']));        
    });

    //TODO test material relation with no derivation, material relation with derivation - the case below to check the main; another test case to test for derivation fact
    it('should transform a derivation relation', () => {
        const class1 = model.createKind('Person');
        const class2 = model.createRelator('Marriage');
        const relation = model.createMaterialRelation(class1, class1, 'married to');
        model.createMediationRelation(class2, class1, 'mediates');
        model.createDerivationRelation(relation, class2, 'derived from');

        const result = generateAlloy(model);
    });

    it('should transform a mediation relation', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
  
        model.createMediationRelation(class1, class2, 'involves');
        
        const result = generateAlloy(model);

        console.log(result);
        expect(result).toContain(generateWorldFieldForRelation('involves', 'Enrollment', 'Student', 'set', 'one'));
        expect(result).toContain(generateFact('relatorConstraint',['all w: World, x: w.Enrollment | #(Student1[x,w])>=2'])); //ensures that there are at least two 'Student' related to each 'Enrollment'.
        expect(result).toContain(generateFact('acyclic',['all w: World | acyclic[w.involves,w.Enrollment]'])); //ensures that 'involves' relation is acyclic for 'Enrollment', i.e., it does not loop back on itself.
        expect(result).toContain(generateFun('Enrollment1','Student','Enrollment','(w.involves).x')); //part of property test?
        expect(result).toContain(generateFun('Student1','Enrollment','Student','x.(w.involves)')); //part of property test?
        expect(result).toContain(generateFact('relationProperties', ['immutable_target[Enrollment,involves]'])); //part of property test?
    });

    it('should generate relator rule for 2 mediation relations', () => {
        const class1 = model.createRelator('Enrollment');
        const class2 = model.createRole('Student');
        const class3 = model.createKind('University');

        const rel1 = model.createMediationRelation(class1, class2, 'involvesStudent');
        rel1.getTargetEnd().setName('Student10');

        const rel2 = model.createMediationRelation(class1, class3, 'involvesUniveristy');
        rel2.getTargetEnd().setName('University110');
        
        const result = generateAlloy(model);

        console.log(result);
        expect(result).toContain(generateFact('relatorConstraint',['all w: World, x: w.Enrollment | #(Student1[x,w])>=2'])); //ensures that there are at least two 'Student' related to each 'Enrollment'.
        
    });

    //there is no case handling this particular type of relation so dunno if it's correct
    it('should transform a characterization relation', () => {

        const class1 = model.createExtrinsicMode('Love');
        const class2 = model.createKind('Person');

        model.createCharacterizationRelation(class1, class2, 'inside');

        const result = generateAlloy(model);

        console.log(result);
        expect(result).toContain(generateWorldFieldForRelation('inside', 'Enrollment', 'Student', 'set', 'one'));
        expect(result).toContain(generateFun('Enrollment1','Student','Enrollment','(w.involves).x')); //part of property test?
        expect(result).toContain(generateFun('Student1','Enrollment','Student','x.(w.involves)')); //part of property test?
        expect(result).toContain(generateFact('relationProperties', ['immutable_target[Enrollment,involves]'])); //part of property test?
    });

    it('should transform a material relation', () => {
    const class1 = model.createKind('Book');
    const class2 = model.createKind('Author');
    const relation = model.createMaterialRelation(class1, class2, 'writtenBy');

    const result = generateAlloy(model);

    expect(result).toContain(generateWorldFieldForRelation('writtenBy', 'Book', 'Author', 'set', ''));
    expect(result).toContain(generateFun('Book1','Author','Book','(w.writtenBy).x')); //part of property test?
    expect(result).toContain(generateFun('Author1','Book','Author','x.(w.writtenBy)')); //part of property test?
});

    it('should transform a part-whole relation', () => {
    const wholeClass = model.createKind('Car');
    const partClass = model.createKind('Engine');
    const relation = model.createPartWholeRelation(wholeClass, partClass, 'hasEngine');

    const result = generateAlloy(model);

    expect(result).toContain(generateWorldFieldForRelation('hasEngine', 'Car', 'Engine', 'set', 'one'));
    expect(result).toContain(generateFact('acyclic',['all w: World | acyclic[w.hasEngine,w.Car]'])); 
    expect(result).toContain(generateFun('Car1','Engine','Car','(w.hasEngine).x')); //part of property test?
    expect(result).toContain(generateFun('Engine1','Car','Engine','x.(w.hasEngine)')); //part of property test?
    expect(result).toContain(generateFact('weakSupplementationConstraint', ['all w: World, x: w.Car | #(Engine1[x,w])>=2'])); 
    expect(result).toContain(generateFact('multiplicity',['all w: World, x: w.Engine | #Car1[x,w]>=2'])); //part of property test?
});

    it('derivation relation from comparative relation', () => {
        
        //there should be a fact containing this below
        "all w: World, x, y: w.Person | some x.(w.CHARACTERIZATION_RELATION_NAME) and some y.(w.CHARACTERIZATION_RELATION_NAME) implies (x in y.(w.COMPARATIVE_RELATION_NAME) or y in x.(w.COMPARATIVE_RELATION_NAME))"
        
    })

});