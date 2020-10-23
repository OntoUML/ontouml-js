import Project from '@libs/project/project';

describe('Project tests', () => {
  let project: Project;

  it('Create Project', async () => {
    const initializeProject = () => {
      console.log('Initializing...');
      project = new Project();
    };
    expect(initializeProject).not.toThrow();
  });
});
