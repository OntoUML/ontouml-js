import {
  modelInvalidExample1,
  modelInvalidExample4,
  modelInvalidExample5,
  modelInvalidExample6,
} from '@test-models/invalids';
import OntoUMLParser from '@libs/ontouml_model/services/ontouml_parser';
import OntoUMLSyntax from '@libs/ontouml_model/services/ontouml_syntax';

describe('OntoUML Syntax', () => {
  describe('OntoUML Example Model 1', () => {
    it('Should return 3 errors of missing stereotype', async () => {
      const parser = new OntoUMLParser(modelInvalidExample1);
      const syntax = new OntoUMLSyntax(parser);

      const errors = await syntax.verifyEndurantTypes();

      expect(errors[0].code).toBe('ontouml_stereotype_error');
      expect(errors.length).toBe(3);
    });
  });

  describe('OntoUML Example Model 4', () => {
    it('Should return an error of ultimate sortal specialization', async () => {
      const parser = new OntoUMLParser(modelInvalidExample4);
      const syntax = new OntoUMLSyntax(parser);

      const errors = await syntax.verifyEndurantTypes();

      expect(errors[0].code).toBe('ontouml_specialization_error');
      expect(errors.length).toBe(1);
    });
  });

  describe('OntoUML Example Model 5', () => {
    it("Should return an error of kind's specialization", async () => {
      const parser = new OntoUMLParser(modelInvalidExample5);
      const syntax = new OntoUMLSyntax(parser);

      const errors = await syntax.verifyEndurantTypes();

      expect(errors[0].code).toBe('ontouml_specialization_error');
      expect(errors.length).toBe(1);
    });
  });

  describe('OntoUML Example Model 6', () => {
    it('Should return an error of non-sortal specialization', async () => {
      const parser = new OntoUMLParser(modelInvalidExample6);
      const syntax = new OntoUMLSyntax(parser);

      const errors = await syntax.verifyEndurantTypes();

      expect(errors[0].code).toBe('ontouml_specialization_error');
      expect(errors.length).toBe(1);
    });
  });
});
