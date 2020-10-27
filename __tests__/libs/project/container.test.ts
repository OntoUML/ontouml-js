import ModelElement from '@libs/project/model_element';
import Package from '@libs/project/package';
import Project from '@libs/project/project';

describe('Container tests', () => {
  it('Get project contents - empty project', async () => {
    const project: Project = new Project();
    let contents: Set<ModelElement> = project.getContents();
    expect(contents).toBeInstanceOf(Set);
    expect(contents.size).toEqual(0);

    contents = project.getAllContents();
    expect(contents).toBeInstanceOf(Set);
    expect(contents.size).toEqual(0);
  });

  it('Get project contents - project containing packages', async () => {
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

  it('Bad content hierarchy error', async () => {
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
});
