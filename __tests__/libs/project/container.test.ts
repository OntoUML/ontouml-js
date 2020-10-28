import Class from '@libs/project/class';
import Literal from '@libs/project/literal';
import ModelElement from '@libs/project/model_element';
import Package from '@libs/project/package';
import Project from '@libs/project/project';
import Property from '@libs/project/property';

describe('Container tests', () => {
  it('Get project contents - empty project', () => {
    const project: Project = new Project();
    let contents: Set<ModelElement> = project.getContents();
    expect(contents).toBeInstanceOf(Set);
    expect(contents.size).toEqual(0);

    contents = project.getAllContents();
    expect(contents).toBeInstanceOf(Set);
    expect(contents.size).toEqual(0);
  });

  it('Get project contents - project containing packages', () => {
    const project: Project = new Project();
    const model = new Package();
    const levelOnePackage = new Package();
    const levelTwoPackage = new Package();

    project.model = model;
    model.contents = [levelOnePackage];
    levelOnePackage.contents = [levelTwoPackage];

    let contents: Set<ModelElement> = project.getContents();
    expect(contents).toBeInstanceOf(Set);
    expect(contents.size).toEqual(1);

    contents = project.getAllContents();
    expect(contents).toContainEqual(model);
    expect(contents).toContainEqual(levelOnePackage);
    expect(contents).toContainEqual(levelTwoPackage);
    expect(contents.size).toEqual(3);
  });

  it('Bad content hierarchy error', () => {
    const model = new Package();
    const levelOnePackage = new Package();
    const levelTwoPackage = new Package();

    // Multiple container for "levelTwoPackage"
    model.contents = [levelOnePackage, levelTwoPackage];
    levelOnePackage.contents = [levelTwoPackage];

    expect(() => model.getAllContents()).toThrowError();

    // Circular containment of "model"
    model.contents = [levelOnePackage];
    levelOnePackage.contents = [model];

    expect(() => model.getAllContents()).toThrowError();
  });

  it('Get class contents', () => {
    const pkg = new Package();
    const person = new Class();
    const livingStatus = new Class();
    const knows = new Property();
    const status = new Property();
    const alive = new Literal();
    const deceased = new Literal();

    pkg.contents = [person, livingStatus];
    person.properties = [knows, status];
    livingStatus.literals = [alive, deceased];

    knows.propertyType = person;
    status.propertyType = livingStatus;

    person.container = pkg;
    livingStatus.container = pkg;
    knows.container = person;
    status.container = person;
    alive.container = livingStatus;
    deceased.container = livingStatus;

    let contents = person.getContents();
    expect(contents).toContain(knows);
    expect(contents).toContain(status);
    expect(contents.size).toEqual(2);

    contents = person.getAllContents();
    expect(contents).toContain(knows);
    expect(contents).toContain(status);
    expect(contents.size).toEqual(2);

    contents = pkg.getAllContents();
    expect(contents.size).toEqual(6);
  });
});
