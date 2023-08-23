import { describe, expect, it, beforeEach, beforeAll } from '@jest/globals';
import { Class, OntoumlElement, Package, Project, Relation } from '../src';

describe('Container tests', () => {
  let project: Project;

  beforeEach(() => {
    project = new Project();
  });

  it('Get project contents - empty project', () => {
    const project: Project = new Project();
    let contents: OntoumlElement[] = project.getContents();
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

    let contents: OntoumlElement[] = project.getContents();
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
    packageOne.setContents([packageTwo, packageThree]);
    packageTwo.setContents([packageThree]);

    expect(() => packageOne.getAllContents()).not.toThrowError();
    expect(packageOne.getContents()).toHaveLength(1);
    expect(packageOne.getContents()).toContain(packageTwo);
    expect(packageTwo.getContents()).toHaveLength(1);
    expect(packageTwo.getContents()).toContain(packageThree);

    // Circular containment of "model"
    packageOne.setContents([packageTwo]);
    packageTwo.setContents([packageOne]);

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
    const clazz = new Class(project);
    const relation = new Relation(project, undefined, [clazz, clazz]);

    const source = relation.getSource();
    const target = relation.getTarget();

    // TODO: consider bringing jest-extended into the project for matchers like toIncludeAllMembers([members])
    let properties: OntoumlElement[] = relation.getContents();
    expect(properties).toContain(source);
    expect(properties).toContain(target);
    expect(properties.length).toEqual(2);
  });
});
