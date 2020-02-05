import {
  modelInvalidExample1,
  modelInvalidExample7,
} from '@test-models/invalids';
import OntoUMLParser from '@libs/ontouml_model/services/ontouml_parser';
import { CLASS_TYPE } from '@constants/';

describe('OntoUML Parser', () => {
  describe('OntoUML Example Invalid Model', () => {
    it('Should return an invalid model', async () => {
      try {
        new OntoUMLParser({
          type: 'Model',
          id: 'invalid.model',
          name: null,
          authors: null,
          elements: null,
        });
      } catch (error) {
        expect(error.detail).toBe('data.id should match format "uri"');
      }
    });
  });

  describe('OntoUML Example Model 1', () => {
    const parser = new OntoUMLParser(modelInvalidExample1);

    it('Should return a valid model', async () => {
      expect(parser.isValid()).toBe(true);
    });

    it('Should get 3 classes from the model', async () => {
      expect(parser.getClasses().length).toBe(3);
    });

    it('Should get 2 childs from the class "ontouml:model.p1.c1"', async () => {
      expect(parser.getClassChildren('ontouml:model.p1.c1').length).toBe(2);
    });

    it('Should get 2 childs from the class "ontouml:model.p1.c1" with type "Class"', async () => {
      const classes = parser
        .getClassChildren('ontouml:model.p1.c1')
        .filter((classEl: IElement) => classEl.type === CLASS_TYPE);
      expect(classes.length).toBe(2);
    });

    it('Should get 1 parent from the class "ontouml:model.c2"', async () => {
      expect(parser.getClassParents('ontouml:model.c2').length).toBe(1);
    });

    it('Should get 2 generalization link from the class "ontouml:model.p1.c1" as general', async () => {
      expect(
        parser.getGeneralizationLinksFromGeneralClass('ontouml:model.p1.c1')
          .length,
      ).toBe(2);
    });

    it('Should get 0 generalization link from the class "ontouml:model.p1.c1" as specific', async () => {
      expect(
        parser.getGeneralizationLinksFromSpecificClass('ontouml:model.p1.c1')
          .length,
      ).toBe(0);
    });

    it('Should get 1 parent from the class "ontouml:model.c2"', async () => {
      expect(parser.getClassParents('ontouml:model.c2').length).toBe(1);
    });
  });

  describe('OntoUML Example Model 7', () => {
    const parser = new OntoUMLParser(modelInvalidExample7);

    it('Should get 1 relation from model', async () => {
      const relations = parser.getRelations();

      expect(relations.length).toBe(1);
    });

    it('Should get a mediation relation from uri "model:#/relation/PersonMachine"', async () => {
      const relation = parser.getRelation('model:#/relation/PersonMachine');

      expect(relation.stereotypes[0]).toBe('ontouml/1.0/mediation');
    });

    it('Should get "model:#/property/Person" as source of relation "model:#/relation/PersonMachine"', async () => {
      const sourceUri = parser.getRelationSourceClassID(
        'model:#/relation/PersonMachine',
      );

      expect(sourceUri).toBe('model:#/class/Person');
    });

    it('Should get "model:#/property/Machine" as target of relation "model:#/relation/PersonMachine"', async () => {
      const sourceUri = parser.getRelationTargetClassID(
        'model:#/relation/PersonMachine',
      );

      expect(sourceUri).toBe('model:#/class/Machine');
    });
  });
});
