import Project from '@libs/project/project';

describe('Project tests', () => {
  let project: Project;

  it('Create Project', () => {
    const initializeProject = () => {
      project = new Project();
    };
    expect(initializeProject).not.toThrow();
  });
});
