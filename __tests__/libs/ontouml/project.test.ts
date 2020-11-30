import { Project } from '@libs/ontouml/';

describe('Project tests', () => {
  it('Create Project', () => {
    let project: Project;
    const initializeProject = () => {
      project = new Project();
    };
    expect(initializeProject).not.toThrow();
  });
});
