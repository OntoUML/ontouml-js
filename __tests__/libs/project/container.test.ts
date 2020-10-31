import { Class, ModelElement, Package, Project, Relation } from '@libs/project/';

describe('Container tests', () => {
  it('Get project contents - empty project', () => {
    const project: Project = new Project();
    let contents: ModelElement[] = project.getContents();
    expect(contents).toBeInstanceOf(Array);
    expect(contents.length).toEqual(0);

    contents = project.getAllContents();
    expect(contents).toBeInstanceOf(Array);
    expect(contents.length).toEqual(0);
  });

  it('Get project contents - non-empty project', () => {
    const project = new Project();
    const model = project.createModel();
    const levelOnePackage = model.createPackage();
    const levelTwoPackage = levelOnePackage.createPackage();
    const classA = levelTwoPackage.createClass();
    const classB = levelTwoPackage.createClass();
    const gen = levelTwoPackage.createGeneralization(classA, classB);
    levelTwoPackage.createGeneralizationSet([gen]);
    const relation = levelTwoPackage.createBinaryRelation(classA, classB);
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    let contents: ModelElement[] = project.getContents();
    expect(contents).toBeInstanceOf(Array);
    expect(contents.length).toEqual(1);

    contents = levelTwoPackage.getContents();
    expect(contents).toContain(relation);
    expect(contents.length).toEqual(5);

    contents = levelTwoPackage.getAllContents();
    expect(contents).toContain(sourceEnd);
    expect(contents).toContain(targetEnd);
    expect(contents.length).toEqual(7);

    contents = project.getAllContents();
    expect(contents).toContain(model);
    expect(contents).toContain(levelOnePackage);
    expect(contents).toContain(levelTwoPackage);

    expect(contents.length).toEqual(10);
  });

  it('Bad content hierarchy error', () => {
    const packageOne = new Package();
    const packageTwo = new Package();
    const packageThree = new Package();

    // Multiple container for "levelTwoPackage"
    packageOne.contents = [packageTwo, packageThree];
    packageTwo.contents = [packageThree];

    expect(() => packageOne.getAllContents()).toThrowError();

    // Circular containment of "model"
    packageOne.contents = [packageTwo];
    packageTwo.contents = [packageOne];

    expect(() => packageOne.getAllContents()).toThrowError();
  });

  it('Get class contents', () => {
    const model = new Package();
    const text = model.createDatatype();
    const livingStatus = model.createEnumeration();
    const alive = livingStatus.createLiteral();
    const deceased = livingStatus.createLiteral();

    const person = model.createClass();
    const knows = person.createAttribute(person);
    const status = person.createAttribute(livingStatus);

    expect(text.getContents().length).toEqual(0);
    expect(text.getAllContents().length).toEqual(0);

    let contents = livingStatus.getContents();
    expect(contents).toContain(alive);
    expect(contents).toContain(deceased);
    expect(contents.length).toEqual(2);

    contents = livingStatus.getAllContents();
    expect(contents).toContain(alive);
    expect(contents).toContain(deceased);
    expect(contents.length).toEqual(2);

    contents = person.getContents();
    expect(contents).toContain(knows);
    expect(contents).toContain(status);
    expect(contents.length).toEqual(2);

    contents = person.getAllContents();
    expect(contents).toContain(knows);
    expect(contents).toContain(status);
    expect(contents.length).toEqual(2);
  });

  it('Get relation contents', () => {
    const person = new Class();
    const admires = new Relation();
    const admiree = admires.createSourceEnd({ propertyType: person });
    const admired = admires.createTargetEnd({ propertyType: person });

    // TODO: consider bringing jest-extended into the project for matchers like toIncludeAllMembers([members])
    let contents: ModelElement[] = admires.getContents();
    expect(contents).toContain(admiree);
    expect(contents).toContain(admired);
    expect(contents.length).toEqual(2);

    contents = admires.getAllContents();
    expect(contents).toContain(admiree);
    expect(contents).toContain(admired);
    expect(contents.length).toEqual(2);
  });
});
