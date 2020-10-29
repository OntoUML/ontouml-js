import Project from '@libs/project/project';

describe('Project tests', () => {
  it('Create Project', () => {
    let project: Project;
    const initializeProject = () => {
      project = new Project();
    };
    expect(initializeProject).not.toThrow();
  });

  it('Serialization test', () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });

    const agent = model.createClass({ name: 'Agent' });
    const person = model.createClass({ name: 'Person' });
    const organization = model.createClass({ name: 'Organization' });
    const text = model.createClass({ name: 'Text' });

    const name = agent.createAttribute({ name: 'name', propertyType: text });
    const surname = person.createAttribute({ name: 'surname', propertyType: text });

    const worksAt = model.createRelation({ name: 'works-for' });

    const employeeEnd = worksAt.createSourceEnd({ name: 'employee', propertyType: person });
    const employerEnd = worksAt.createTargetEnd({ name: 'employer', propertyType: organization });

    const agentIntoPerson = model.createGeneralization({ name: 'agentIntoPerson', general: agent, specific: person });
    const agentIntoOrganization = model.createGeneralization({
      name: 'agentIntoOrganization',
      general: agent,
      specific: organization
    });

    const agentsSet = model.createGeneralizationSet({
      name: 'agentsSet',
      generalizations: [agentIntoPerson, agentIntoOrganization],
      isComplete: true,
      isDisjoint: true
    });

    expect(() => JSON.stringify(project)).not.toThrow();
  });
});
