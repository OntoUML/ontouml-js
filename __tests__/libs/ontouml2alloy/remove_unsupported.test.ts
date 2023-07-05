import { Class, OntoumlElement, Package, Project, Property, Relation } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldFieldForClass, generateWorldFact, generateFun } from './helpers'
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
    expect(result).not.toContain(generateFact('generalization', ['Wedding in Ceremony']));
    expect(result).not.toContain(generateFact('generalization', ['Graduation in Ceremony']));
    expect(result).not.toContain(generateFact('generalizationSet', ['disjoint[Wedding,Graduation]']));

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

  it('removes relations with unsupported source class', () => {
    const unsupportedSource = model.createEvent('Ceremony');
    const supportedTarget = model.createKind('Party');

    const relation1 = model.createMaterialRelation(unsupportedSource, supportedTarget, 'R1');

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain('R1');
    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(relation1.id);
  });

  it('removes relations with unsupported target class', () => {
    const supportedSource = model.createKind('Person');
    const unsupportedTarget = model.createType('PartyType');

    const relation2 = model.createMaterialRelation(supportedSource, unsupportedTarget, 'R2');

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain('R2');
    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(relation2.id);
  });

  it('removes generalizations with unsupported specific class', () => {
    const unsupportedSpecific = model.createSituation('Meeting');
    const supportedGeneral = model.createKind('Party');

    const generalization1 = model.createGeneralization(supportedGeneral, unsupportedSpecific);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain(generateFact('generalization', ['Meeting in Party']));
    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(generalization1.id);
  });

  it('removes generalizations with unsupported general class', () => {
    const supportedSpecific = model.createKind('Person');
    const unsupportedGeneral = model.createSituation('Event');

    const generalization2 = model.createGeneralization(unsupportedGeneral, supportedSpecific);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain(generateFact('generalization', ['Person in Event']));
    expect(issues).toBeDefined();
    expect(issues.length).toBe(2);
    expect(issues.map(issue => issue.id)).toContain(generalization2.id);
  });

  it('removes generalization sets with all unsupported elements', () => {
    const unsupportedParent = model.createEvent('Ceremony');
    const unsupportedChild1 = model.createEvent('Wedding');
    const unsupportedChild2 = model.createEvent('Graduation');

    const unsupportedGen1 = model.createGeneralization(unsupportedParent, unsupportedChild1);
    const unsupportedGen2 = model.createGeneralization(unsupportedParent, unsupportedChild2);

    const unsupportedGenSet = model.createGeneralizationSet([unsupportedGen1, unsupportedGen2], true, false);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).not.toContain(generateFact('generalization', ['Wedding in Ceremony']));
    expect(result).not.toContain(generateFact('generalization', ['Graduation in Ceremony']));
    expect(result).not.toContain(generateFact('generalizationSet', ['disjoint[Wedding,Graduation]']));


    expect(issues).toBeDefined();
    expect(issues.length).toBe(6);
    expect(issues.map(issue => issue.id)).toContain(unsupportedGenSet.id);
  });

  it('removes generalization sets with a mix of unsupported and supported elements', () => {
    const supportedParent = model.createKind('Person');
    const unsupportedChild = model.createEvent('Graduation');
    const supportedChild = model.createSubkind('Man');

    const unsupportedGen = model.createGeneralization(supportedParent, unsupportedChild);
    const supportedGen = model.createGeneralization(supportedParent, supportedChild);

    const mixedGenSet = model.createGeneralizationSet([unsupportedGen, supportedGen], true, false);

    const ontouml2alloy = new Ontouml2Alloy(model);
    let { result, issues } = ontouml2alloy.run();
    result = ontouml2alloy.getAlloyCode()[0];

    expect(result).toContain(generateFact('generalization', ['Man in Person']));
    expect(result).not.toContain(generateFact('generalization', ['Graduation in Person']));
    expect(result).not.toContain(generateFact('generalizationSet', ['disjoint[Graduation,Man]']));

    expect(issues).toBeDefined();
    expect(issues.length).toBe(3);
    expect(issues.map(issue => issue.id)).toContain(mixedGenSet.id);
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

});
