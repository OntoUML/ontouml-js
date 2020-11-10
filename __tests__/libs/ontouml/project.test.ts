import { Project } from '@libs/ontouml/';

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

    const agent = model.createCategory('Agent');
    const person = model.createKind('Person');
    const organization = model.createKind('Organization');
    const text = model.createDatatype('Text');

    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });

    const worksAt = model.createBinaryRelation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

    model.createPartition([agentIntoPerson, agentIntoOrganization], 'agentsSet');

    expect(() => JSON.stringify(project)).not.toThrow();
  });
});
