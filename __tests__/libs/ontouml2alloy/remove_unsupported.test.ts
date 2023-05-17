import { Class, OntoumlElement, Package, Project, Property, Relation } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldAttribute, generateWorldFact, generateFun } from './helpers'
import { Ontouml2Alloy } from '@libs/ontouml2alloy/index';


describe("removeUnsupportedElements function", () => {

    let project: Project;
    let model: Package;

    beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });
  
  //TODO deep copy of model

  it('removes <<event>> & connected generalizations, attributes', () => {
  
      // Add unsupported elements to the model
      const parent = model.createEvent('Ceremony');
      const child1 = model.createEvent('Wedding');
      const child2 = model.createEvent('Graduation');
      const address = model.createDatatype('Address');
      const place = parent.createAttribute(address, 'Enschede');
      const gen1 = model.createGeneralization(parent, child1, 'gen1');
      const gen2 = model.createGeneralization(parent, child2, 'gen2');
      const genSet = model.createGeneralizationSet([gen1, gen2], true, false);
  
      // Add supported elements to the model
      const supportedClass = model.createKind('Person');
      const text = model.createDatatype('Text');
      const surname = supportedClass.createAttribute(text, 'surname');
      
      // Call the removeUnsupportedElements function (indirectly)
      const ontouml2alloy = new Ontouml2Alloy(model);
      let { result, issues } = ontouml2alloy.run();
      result = ontouml2alloy.getAlloyCode()[0];
      
      // Check if unsupported elements are removed
      expect(result).not.toContain('Ceremony');
      expect(result).not.toContain('Wedding');
      expect(result).not.toContain('Graduation');
      expect(result).not.toContain('Enschede');
      expect(result).not.toContain(generateFact('generalization',['Wedding in Ceremony']));
      expect(result).not.toContain(generateFact('generalization',['Graduation in Ceremony']));
      expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Wedding,Graduation]']));
    
      // Check if supported elements are retained
      expect(result).toContain('Person');
      expect(result).toContain('surname');

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
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain('R1');
    expect(result).not.toContain('R2');
    expect(result).toContain(generateFun('Person1', 'Party', 'Person', '(w.R3).x'));
    expect(result).toContain(generateFun('Party1', 'Person', 'Party', 'x.(w.R3)'));

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
  
    const generalization1 = model.createGeneralization(supportedGeneral, unsupportedSpecific);
    const generalization2 = model.createGeneralization(unsupportedGeneral, supportedSpecific);
    const generalization3 = model.createGeneralization(supportedGeneral, supportedSpecific);
  
    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];
  
    expect(result).not.toContain(generateFact('generalization', ['Meeting in Party']));
    expect(result).not.toContain(generateFact('generalization', ['Person in Event']));
    expect(result).toContain(generateFact('generalization', ['Person in Party']));
  
    expect(issues).toBeDefined();
    expect(issues.length).toBe(4);
    expect(issues.map(issue => issue.id)).toContain(generalization1.id);
    expect(issues.map(issue => issue.id)).toContain(generalization2.id);
  });

  it('removes generalization sets containing unsupported elements', () => {

    const unsupportedParent = model.createEvent('Ceremony');
    const unsupportedChild1 = model.createEvent('Wedding');
    const unsupportedchild2 = model.createEvent('Graduation');
    const supportedParent = model.createKind('Person');
    const supportedChild1 = model.createSubkind('Man');
    const supportedChild2 = model.createSubkind('Woman');

    //mix of supported and unsupported generalizations
    const unsupportedGen1 = model.createGeneralization(unsupportedParent, unsupportedChild1);
    const unsupportedGen2 = model.createGeneralization(supportedParent, unsupportedchild2);
    const unsupportedGen3 = model.createGeneralization(unsupportedParent, supportedChild1);
    const supportedGen4 = model.createGeneralization(supportedParent, supportedChild1);
    const supportedGen5 = model.createGeneralization(supportedParent, supportedChild2);

    //test for mix of generalization sets with unsupported and supported generalizations
    const unsupportedgenSet1 = model.createGeneralizationSet([unsupportedGen1, unsupportedGen2], true, false);
    const unsupportedgenSet2 = model.createGeneralizationSet([unsupportedGen2, supportedGen4], true, false);
    const unsupportedgenSet3 = model.createGeneralizationSet([unsupportedGen3, supportedGen4], true, false);
    const supportedGenSet4 = model.createGeneralizationSet([supportedGen4, supportedGen5], true, false);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];
  
    expect(result).not.toContain(generateFact('generalization',[' Wedding in Ceremony']));
    expect(result).toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));

    expect(issues).toBeDefined();
    expect(issues.length).toBe(9);
    expect(issues.map(issue => issue.id)).toContain(unsupportedgenSet1.id);
    expect(issues.map(issue => issue.id)).toContain(unsupportedgenSet2.id);
    expect(issues.map(issue => issue.id)).toContain(unsupportedgenSet3.id);

  });

  it('removes generalization sets with categorizers having unsupported stereotypes', () => {
    const supportedParent = model.createKind('Person');
    const supportedChild1 = model.createSubkind('Man');
    const supportedChild2 = model.createSubkind('Woman');
    const unsupportedCategorizer = model.createType('CategoryType');

    const gen1 = model.createGeneralization(supportedParent,supportedChild1);
    const gen2 = model.createGeneralization(supportedParent, supportedChild2);

    const genSet1 = model.createGeneralizationSet([gen1, gen2], true, false, unsupportedCategorizer);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));

    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(genSet1.id);
  });  

  it('removes <<type>> classes and retains others', () => {
    const typeClass = model.createType('PartyType');
    const kindClass = model.createKind('Person');

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain('PartyType');
    expect(result).toContain('Person');

    expect(issues).toBeDefined();
    expect(issues.length).toBe(1);
    expect(issues.map(issue => issue.id)).toContain(typeClass.id);
  });

  it('removes <<situation>> classes and retains others', () => {
    const situationClass = model.createSituation('Meeting');
    const kindClass = model.createKind('Person');

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain('Meeting');
    expect(result).toContain('Person');

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
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];
  
    expect(result).not.toContainEqual('name');
    expect(result).toContain('surname');

    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(unsupportedAttribute.id);
  });

  //TODO how to check relation ends?
  it('removes relation-ends connected to unsupported elements', () => {
    const unsupportedSource = model.createEvent('Ceremony');
    const unsupportedTarget = model.createType('PartyType');
    const supportedSource = model.createKind('Person');
    const supportedTarget = model.createKind('Party');
  
    const relation1 = model.createMaterialRelation(unsupportedSource, supportedTarget, 'R1');
    const relation2 = model.createMaterialRelation(supportedSource, unsupportedTarget, 'R2');
  
    const sourceEnd1 = relation1.getSourceEnd();
    const targetEnd1 = relation1.getTargetEnd();
    const sourceEnd2 = relation2.getSourceEnd();
    const targetEnd2 = relation2.getTargetEnd();
  
    const ontouml2alloy = new Ontouml2Alloy(model);
    const { result, issues } = ontouml2alloy.run();

    expect(model.getAllProperties()).not.toContain(sourceEnd1);
    expect(model.getAllProperties()).not.toContain(targetEnd1);
    expect(model.getAllProperties()).not.toContain(sourceEnd2);
    expect(model.getAllProperties()).not.toContain(targetEnd2);
  });
  


});
