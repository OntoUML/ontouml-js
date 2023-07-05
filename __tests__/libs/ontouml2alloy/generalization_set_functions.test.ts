import { transformGeneralizationSet, Ontouml2Alloy } from '@libs/ontouml2alloy';
import { Package, Project } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldFieldForClass } from './helpers';
import { Generalization } from '@libs/ontouml';


describe('Generalization Set Functions', () => {

  let project: Project;
  let model: Package;

  beforeEach(() => {
      project = new Project();
      model = project.createModel();
    });

    describe ('«kind» Person <|- «subkind» Man, «subkind» Woman, all options', () => {

      let gen1: Generalization;
      let gen2: Generalization;

      beforeEach(() => {
        const parent = model.createKind('Person');
        const child1 = model.createSubkind('Man');
        const child2 = model.createSubkind('Woman');
  
        gen1 = model.createGeneralization(parent, child1);
        gen2 = model.createGeneralization(parent, child2);
      });
    
      it('disjoint - true, complete - true' , () => {

        model.createGeneralizationSet(
          [gen1, gen2],
          true, // isDisjoint
          true, // isComplete
        );
  
        const result = generateAlloy(model);
  
        expect(result).toContain(generateFact('generalizationSet',['disjoint[Man,Woman]','Person = Man+Woman']));
      });

      it('disjoint - false, complete - false', () => {
        model.createGeneralizationSet(
          [gen1, gen2],
          false, // isDisjoint
          false, // isComplete
        );
      
        const result = generateAlloy(model);

        expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Man,Woman]','Person = Man+Woman']));
      });

      it('disjoint - true, complete - false', () => {
      
        model.createGeneralizationSet(
          [gen1, gen2],
          true, // isDisjoint
          false, // isComplete
        );
      
        const result = generateAlloy(model);

        expect(result).toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));
        expect(result).not.toContain(generateFact('generalizationSet',['Person = Man+Woman']));
      });

      it('disjoint - false, complete - true', () => {
      
        model.createGeneralizationSet(
          [gen1, gen2],
          false, // isDisjoint
          true, // isComplete
        );
      
        const result = generateAlloy(model);

        expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));
        expect(result).toContain(generateFact('generalizationSet',['Person = Man+Woman']));
    });

  });

    it('«datatype» Color <|- «datatype» ColorInRgb, «datatype» ColorInHsv', () => {
      const parent = model.createDatatype('Color');
      const child1 = model.createDatatype('ColorInRgb');
      const child2 = model.createDatatype('ColorInHsv');
      const gen1 = model.createGeneralization(parent, child1, 'gen1');
      const gen2 = model.createGeneralization(parent, child2, 'gen2');
      model.createGeneralizationSet([gen1, gen2], true, false);

      const result = generateAlloy(model);
      expect(result).toContain(generateFact('generalizationSet', ['disjoint[ColorInRgb,ColorInHsv]']));
    });
    

    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const parent = model.createKind('Person');
      const child1 = model.createPhase('Child');
      const child2 = model.createPhase('Adult');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]); 

      const result = generateAlloy(model);
      expect(result).toContain(generateFact('generalizationSet',['disjoint[Child,Adult]','Person = Child+Adult']));
    });

    it('«category» Agent <|- «roleMixin» Customer, «roleMixin» Provider', () => {
      const parent = model.createCategory('Agent');
      const child1 = model.createRoleMixin('Customer');
      const child2 = model.createRoleMixin('Provider');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const result = generateAlloy(model);
      expect(result).toContain(generateFact('generalizationSet',['disjoint[Customer,Provider]','Agent = Customer+Provider']));
    });
  });
