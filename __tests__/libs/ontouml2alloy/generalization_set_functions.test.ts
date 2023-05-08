import { transformGeneralizationSet, Ontouml2Alloy } from '@libs/ontouml2alloy';
import { Package, Project } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldAttribute } from './helpers';
import { Generalization } from '@libs/ontouml';


describe('Generalization Set Functions', () => {

  let project: Project;
  let model: Package;

  beforeEach(() => {
      project = new Project();
      model = project.createModel();
    });

  describe('Should add disjointness constraint from a disjoint GS involving only rigid children classes', () => {
    
    
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
  
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
        expect(result).toContain(generateWorldAttribute('Person','Object'));
  
        expect(result).toContain(generateFact('generalization',['Man in Person']));
        expect(result).toContain(generateFact('generalization',['Woman in Person']));
        expect(result).toContain(generateFact('generalizationSet',['disjoint[Man,Woman]','Person = Man+Woman']));
  
        expect(result).toContain(generateFact('rigid',['rigidity[Man,Object,exists]']))
        expect(result).toContain(generateFact('rigid',['rigidity[Woman,Object,exists]']))
        
        expect(result).toContain(generateWorldAttribute('Man','Object'));
        expect(result).toContain(generateWorldAttribute('Woman','Object'));
      });

      it('disjoint - false, complete - false', () => {
        model.createGeneralizationSet(
          [gen1, gen2],
          false, // isDisjoint
          false, // isComplete
        );
      
        const result = generateAlloy(model);
      
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
        expect(result).toContain(generateWorldAttribute('Person','Object'));
  
        expect(result).toContain(generateFact('generalization',['Man in Person']));
        expect(result).toContain(generateFact('generalization',['Woman in Person']));
        expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Man,Woman]','Person = Man+Woman']));
  
        expect(result).toContain(generateFact('rigid',['rigidity[Man,Object,exists]']))
        expect(result).toContain(generateFact('rigid',['rigidity[Woman,Object,exists]']))
  
        expect(result).toContain(generateWorldAttribute('Man','Object'));
        expect(result).toContain(generateWorldAttribute('Woman','Object'));
      });

      it('disjoint - true, complete - false', () => {
      
        model.createGeneralizationSet(
          [gen1, gen2],
          true, // isDisjoint
          false, // isComplete
        );
      
        const result = generateAlloy(model);
      
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
        expect(result).toContain(generateWorldAttribute('Person','Object'));
  
        expect(result).toContain(generateFact('generalization',['Man in Person']));
        expect(result).toContain(generateFact('generalization',['Woman in Person']));
        expect(result).toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));
        expect(result).not.toContain(generateFact('generalizationSet',['Person = Man+Woman']));
  
        expect(result).toContain(generateFact('rigid',['rigidity[Man,Object,exists]']))
        expect(result).toContain(generateFact('rigid',['rigidity[Woman,Object,exists]']))
  
        expect(result).toContain(generateWorldAttribute('Man','Object'));
        expect(result).toContain(generateWorldAttribute('Woman','Object'));
      });

      it('disjoint - false, complete - true', () => {
      
        model.createGeneralizationSet(
          [gen1, gen2],
          false, // isDisjoint
          true, // isComplete
        );
      
        const result = generateAlloy(model);
      
        expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
        expect(result).toContain(generateWorldAttribute('Person','Object'));
  
        expect(result).toContain(generateFact('generalization',['Man in Person']));
        expect(result).toContain(generateFact('generalization',['Woman in Person']));
        expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Man,Woman]']));
        expect(result).toContain(generateFact('generalizationSet',['Person = Man+Woman']));
  
        expect(result).toContain(generateFact('rigid',['rigidity[Man,Object,exists]']))
        expect(result).toContain(generateFact('rigid',['rigidity[Woman,Object,exists]']))
  
        expect(result).toContain(generateWorldAttribute('Man','Object'));
        expect(result).toContain(generateWorldAttribute('Woman','Object'));
      });
    });

    //TODO - interesting case, event classes are not transformed but a generalization & generalization_set is created
    it('«event» Ceremony <|- «event» Wedding, «event» Graduation', () => {
      const parent = model.createEvent('Ceremony');
      const child1 = model.createEvent('Wedding');
      const child2 = model.createEvent('Graduation');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const result = generateAlloy(model);
      expect(result).not.toContain(generateFact('generalization',[' Wedding in Ceremony']));
    });

    it('«datatype» Color <|- «datatype» ColorInRgb, «datatype» ColorInHsv', () => {
      const parent = model.createDatatype('Color');
      const child1 = model.createDatatype('ColorInRgb');
      const child2 = model.createDatatype('ColorInHsv');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const result = generateAlloy(model);
      
      expect(result).toContain('sig Color in Datatype {}');
      expect(result).toContain('sig ColorInRgb in Datatype {}');
      expect(result).toContain('sig ColorInHsv in Datatype {}');

      expect(result).toContain(generateFact('additionalDatatypeFacts', ['Datatype = Color+ColorInRgb+ColorInHsv']));

      expect(result).toContain(generateFact('generalization', ['ColorInRgb in Color']));
      expect(result).toContain(generateFact('generalization', ['ColorInHsv in Color']));

      expect(result).toContain(generateFact('generalizationSet', ['disjoint[ColorInRgb,ColorInHsv]']));
    });


  });

  //TODO why should there not be a disjoint constraint?
  describe('Should NOT add disjointness constraint from a disjoint GS involving an antirigid or a semirigid class...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const parent = model.createKind('Person');
      const child1 = model.createPhase('Child');
      const child2 = model.createPhase('Adult');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]); 

      const result = generateAlloy(model);
      expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Child,Adult]','Person = Child+Adult']));

      expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
      expect(result).toContain(generateFact('antirigid',['antirigidity[Child,Object,exists]']))
      expect(result).toContain(generateFact('antirigid',['antirigidity[Adult,Object,exists]']))

      expect(result).toContain(generateWorldAttribute('Person','Object'));
      expect(result).toContain(generateWorldAttribute('Child','Object'));
      expect(result).toContain(generateWorldAttribute('Adult','Object'));

      expect(result).toContain(generateFact('generalization',['Child in Person']));
      expect(result).toContain(generateFact('generalization',['Adult in Person'])); 
    });

    it('«category» Agent <|- «roleMixin» Customer, «roleMixin» Provider', () => {
      const parent = model.createCategory('Agent');
      const child1 = model.createRoleMixin('Customer');
      const child2 = model.createRoleMixin('Provider');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const result = generateAlloy(model);
      expect(result).not.toContain(generateFact('generalizationSet',['disjoint[Customer,Provider]','Agent = Customer+Provider']));

      expect(result).toContain(generateFact('rigid',['rigidity[Agent,Object,exists]']));
      expect(result).toContain(generateFact('antirigid',['antirigidity[Customer,Object,exists]']));
      expect(result).toContain(generateFact('antirigid',['antirigidity[Provider,Object,exists]']));

      expect(result).toContain(generateFact('abstractClass',['all w: World | w.Agent = w.Customer+w.Provider']));

      expect(result).toContain(generateWorldAttribute('Agent','Object'));
      expect(result).toContain(generateWorldAttribute('Customer','Object'));
      expect(result).toContain(generateWorldAttribute('Provider','Object'));

      expect(result).toContain(generateFact('generalization',['Customer in Agent']));
      expect(result).toContain(generateFact('generalization',['Provider in Agent']));

    });

    //mixin, semirigid not handled
    // it('«mixin» Insurable <|- «mixin» ExpensiveObject, «category» RareObject', () => {
    //   const parent = model.createMixin('Insurable');
    //   const child1 = model.createMixin('ExpensiveObject');
    //   const child2 = model.createCategory('RareObject');
    //   const gen1 = model.createGeneralization(parent, child1);
    //   const gen2 = model.createGeneralization(parent, child2);
    //   model.createPartition([gen1, gen2]);

    //   const owl = generateGufo(model);
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:ExpensiveObject> <:RareObject>) .');
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:RareObject> <:ExpensiveObject>) .');
    // });
  });

  describe('Should add an equivalence constraint from a complete GS...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const parent = model.createKind('Person');
      const child1 = model.createPhase('Child');
      const child2 = model.createPhase('Adult');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const result = generateAlloy(model);
      expect(result).toContain(generateFact('generalizationSet',['disjoint[Child,Adult]','Person = Child+Adult']));

      expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
      expect(result).toContain(generateFact('antirigid',['antirigidity[Child,Object,exists]']))
      expect(result).toContain(generateFact('antirigid',['antirigidity[Adult,Object,exists]']))

      expect(result).toContain(generateWorldAttribute('Person','Object'));
      expect(result).toContain(generateWorldAttribute('Child','Object'));
      expect(result).toContain(generateWorldAttribute('Adult','Object'));

      expect(result).toContain(generateFact('generalization',['Child in Person']));
      expect(result).toContain(generateFact('generalization',['Adult in Person']));

    });
  });

});
