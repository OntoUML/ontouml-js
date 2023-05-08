import { Class, OntoumlElement, Package, Project, Property, Relation } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact } from './helpers'
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';


describe("removeUnsupportedElements function", () => {

    let project: Project;
    let model: Package;

    beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

    it('removes <<event>> & connected generalizations, attributes', () => {
    
        // Add unsupported elements to the model
        const parent = model.createEvent('Ceremony');
        const child1 = model.createEvent('Wedding');
        const child2 = model.createEvent('Graduation');
        const address = model.createDatatype('Address');
        const place = parent.createAttribute(address, 'Enschede');
        const gen1 = model.createGeneralization(parent, child1);
        const gen2 = model.createGeneralization(parent, child2);
        const genSet = model.createGeneralizationSet([gen1, gen2], true, false);
    
        // Add supported elements to the model
        const supportedClass = model.createKind('Person');
        const text = model.createDatatype('Text');
        const surname = supportedClass.createAttribute(text, 'surname');
        
        // Call the removeUnsupportedElements function (indirectly)
        const ontouml2alloy = new Ontouml2Alloy(model);
        const { result, issues } = ontouml2alloy.run();
        
        // Check if unsupported elements are removed
        expect(model.getAllClasses()).not.toContain(parent);
        expect(model.getAllClasses()).not.toContain(child1);
        expect(model.getAllClasses()).not.toContain(child2);
        expect(model.getAllRelations()).not.toContain(gen1);
        expect(model.getAllRelations()).not.toContain(gen2);
        expect(model.getAllGeneralizationSets()).not.toContain(genSet);
        expect(model.getAllAttributes()).not.toContain(place);
    
        // Check if supported elements are retained
        expect(model.getAllClasses()).toContain(supportedClass);
        expect(model.getAllAttributes()).toContain(surname);

        // Check if issues are returned properly
        expect(issues).toBeDefined();
        expect(issues.length).toBe(7);
        expect(issues.map(issue => issue.id)).toContain(parent.id);
        expect(issues.map(issue => issue.id)).toContain(child1.id);
        expect(issues.map(issue => issue.id)).toContain(child2.id);
        expect(issues.map(issue => issue.id)).toContain(place.id);
        expect(issues.map(issue => issue.id)).toContain(gen1.id);
        expect(issues.map(issue => issue.id)).toContain(gen2.id);
        expect(issues.map(issue => issue.id)).toContain(genSet.id);
        
        //Printing of 'issues' for debugging purposes
        // issues.forEach((issue, index) => {
        //   console.log(`Issue #${index + 1}:\nDescription: ${issue.description}\nData: ${JSON.stringify(issue.data.name, null, 2)}\n`);
        // });
      });

  it('removes relations connected to unsupported classes', () => {
    const unsupportedSource = model.createEvent('Ceremony');
    const unsupportedTarget = model.createType('PartyType');
    const supportedSource = model.createKind('Person');
    const supportedTarget = model.createKind('Party');

    const relation1 = model.createMaterialRelation(unsupportedSource, supportedTarget, 'R1');
    const relation2 = model.createMaterialRelation(supportedSource, unsupportedTarget, 'R2');
    const relation3 = model.createMaterialRelation(supportedSource, supportedTarget, 'R3');

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllRelations()).not.toContain(relation1);
    expect(model.getAllRelations()).not.toContain(relation2);
    expect(model.getAllRelations()).toContain(relation3);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(4);
    expect(issues.map(issue => issue.id)).toContain(relation1.id);
    expect(issues.map(issue => issue.id)).toContain(relation2.id);
  });

  it('removes generalizations consisting of unsupported elements', () => {
    const unsupportedSpecific = model.createSituation('Meeting');
    const unsupportedGeneral = model.createSituation('Event');
    const supportedSpecific = model.createKind('Person');
    const supportedGeneral = model.createKind('Party');

    const generalization1 = model.createGeneralization(unsupportedSpecific, supportedGeneral);
    const generalization2 = model.createGeneralization(supportedSpecific, unsupportedGeneral);
    const generalization3 = model.createGeneralization(supportedSpecific, supportedGeneral);

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllGeneralizations()).not.toContain(generalization1);
    expect(model.getAllGeneralizations()).not.toContain(generalization2);
    expect(model.getAllGeneralizations()).toContain(generalization3);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(4);
    expect(issues.map(issue => issue.id)).toContain(generalization1.id);
    expect(issues.map(issue => issue.id)).toContain(generalization2.id);
  });

  it('removes generalization sets containing unsupported elements', () => {
    const unsupportedSpecific = model.createSituation('Meeting');
    const unsupportedGeneral = model.createSituation('Event');
    const supportedSpecific = model.createKind('Person');
    const supportedGeneral = model.createKind('Party');

    const gen1 = model.createGeneralization(unsupportedSpecific, supportedGeneral);
    const gen2 = model.createGeneralization(supportedSpecific, unsupportedGeneral);
    const gen3 = model.createGeneralization(supportedSpecific, supportedGeneral);
    const gen4 = model.createGeneralization(supportedSpecific, supportedGeneral);

    const genSet1 = model.createGeneralizationSet([gen1, gen3], true, false);
    const genSet2 = model.createGeneralizationSet([gen2, gen4], true, false);
    const genSet3 = model.createGeneralizationSet([gen3, gen4], true, false);

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllGeneralizationSets()).not.toContain(genSet1);
    expect(model.getAllGeneralizationSets()).not.toContain(genSet2);
    expect(model.getAllGeneralizationSets()).toContain(genSet3);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(6);
    expect(issues.map(issue => issue.id)).toContain(genSet1.id);
    expect(issues.map(issue => issue.id)).toContain(genSet2.id);
  });

  it('removes generalization sets with categorizers having unsupported stereotypes', () => {
    const supportedSpecific = model.createKind('Person');
    const supportedGeneral = model.createKind('Party');
    const unsupportedCategorizer = model.createType('CategoryType');

    const gen1 = model.createGeneralization(supportedSpecific, supportedGeneral);
    const gen2 = model.createGeneralization(supportedSpecific, supportedGeneral);

    const genSet1 = model.createGeneralizationSet([gen1, gen2], true, false, unsupportedCategorizer);
    const genSet2 = model.createGeneralizationSet([gen1, gen2], true, false);

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllGeneralizationSets()).not.toContain(genSet1);
    expect(model.getAllGeneralizationSets()).toContain(genSet2);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(genSet1.id);
  });  

  it('removes <<type>> classes and retains others', () => {
    const typeClass = model.createType('PartyType');
    const kindClass = model.createKind('Person');

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllClasses()).not.toContain(typeClass);
    expect(model.getAllClasses()).toContain(kindClass);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(1);
    expect(issues.map(issue => issue.id)).toContain(typeClass.id);
  });

  it('removes <<situation>> classes and retains others', () => {
    const situationClass = model.createSituation('Meeting');
    const kindClass = model.createKind('Person');

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllClasses()).not.toContain(situationClass);
    expect(model.getAllClasses()).toContain(kindClass);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(1);
    expect(issues.map(issue => issue.id)).toContain(situationClass.id);
  });

  it('removes attributes of unsupported classes', () => {
    const unsupportedClass = model.createEvent('Ceremony');
    const supportedClass = model.createKind('Person');

    const datatype = model.createDatatype('Text');
    const unsupportedAttribute = unsupportedClass.createAttribute(datatype, 'name');
    const supportedAttribute = supportedClass.createAttribute(datatype, 'surname');

    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllAttributes()).not.toContain(unsupportedAttribute);
    expect(model.getAllAttributes()).toContain(supportedAttribute);

    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(unsupportedAttribute.id);
  });

  it('removes relation-ends connected to unsupported elements', () => {
    const unsupportedSource = model.createEvent('Ceremony');
    const unsupportedTarget = model.createType('PartyType');
    const supportedSource = model.createKind('Person');
    const supportedTarget = model.createKind('Party');
  
    const relation1 = model.createMaterialRelation(unsupportedSource, supportedTarget, 'R1');
    const relation2 = model.createMaterialRelation(supportedSource, unsupportedTarget, 'R2');
    const relation3 = model.createMaterialRelation(supportedSource, supportedTarget, 'R3');
  
    const sourceEnd1 = relation1.getSourceEnd();
    const targetEnd1 = relation1.getTargetEnd();
    const sourceEnd2 = relation2.getSourceEnd();
    const targetEnd2 = relation2.getTargetEnd();
    const sourceEnd3 = relation3.getSourceEnd();
    const targetEnd3 = relation3.getTargetEnd();
  
    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllProperties()).not.toContain(sourceEnd1);
    expect(model.getAllProperties()).not.toContain(targetEnd1);
    expect(model.getAllProperties()).not.toContain(sourceEnd2);
    expect(model.getAllProperties()).not.toContain(targetEnd2);
    expect(model.getAllProperties()).toContain(sourceEnd3);
    expect(model.getAllProperties()).toContain(targetEnd3);

    //TODO discuss whether it's necessary to generate an issue for relation-ends
  });
  



});
