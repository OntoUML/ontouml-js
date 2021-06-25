import { Project, Diagram, Package } from '@libs/ontouml';
import { Modularizer } from '@libs/complexity';

describe('buildAll()', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('Should not generate any diagram for an empty project', () => {
    let diagrams: Diagram[] = new Modularizer(project).buildAll();
    expect(diagrams).toHaveLength(0);
  });

  it('Should not generate any diagram for a project without relators', () => {
    model.createKind('Person');
    let diagrams: Diagram[] = new Modularizer(project).buildAll();
    expect(diagrams).toHaveLength(0);
  });

  it('Should not break if project contains a class without a stereotype', () => {
    model.createClass('Person');
    let diagrams: Diagram[] = new Modularizer(project).buildAll();
    expect(diagrams).toHaveLength(0);
  });
});

describe('run()', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  it('Should return a project in the result field even if the project is empty', () => {
    const { result } = new Modularizer(project).run();
    expect(result).toBeInstanceOf(Project);
  });

  it('Should return a project in the result field even if the project has no relators', () => {
    model.createKind('Person');
    const { result } = new Modularizer(project).run();
    expect(result).toBeInstanceOf(Project);
  });

  it('Should not break if project contains a class without a stereotype', () => {
    model.createClass('Person');
    const { result } = new Modularizer(project).run();
    expect(result).toBeInstanceOf(Project);
  });
});
