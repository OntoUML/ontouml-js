import { Project } from '@libs/ontouml';
import { Ontouml2Db, Ontouml2DbOptions } from '@libs/ontouml2db';

describe('Tests Ontouml2Db', () => {
  describe('Test sample Project transformation', () => {
    const project = new Project();
    const model = project.createModel();
    const person = model.createKind('Person');

    const options = new Ontouml2DbOptions();

    it('Should not throw exceptions', () => expect(() => new Ontouml2Db(project, options).run()).not.toThrow());
  });
});
