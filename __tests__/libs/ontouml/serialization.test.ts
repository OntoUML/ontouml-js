import { Project, serialization } from '@libs/ontouml/';

describe('Serialization tests', () => {
  it('Project serialization', () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });

    const agent = model.createCategory('Agent');
    const person = model.createKind('Person');
    const organization = model.createKind('Organization');
    const text = model.createDatatype('Text');

    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });

    model.createBinaryRelation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

    model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    expect(() => JSON.stringify(project)).not.toThrow();
    expect(serialization.validate(project)).toBeTruthy();
  });

  describe(`Test serialization.${serialization.validate}()`, () => {
    const project = new Project();

    it('Test project serialization', () => expect(serialization.validate(project)).toBeTruthy());
    it('Test string serialization', () => expect(serialization.validate(JSON.stringify(project))).toBeTruthy());
    it('Test object serialization', () => expect(serialization.validate(JSON.parse(JSON.stringify(project)))).toBeTruthy());
    it('Test invalid input', () => expect(() => serialization.validate(true as any)).toThrow());
  });
});
