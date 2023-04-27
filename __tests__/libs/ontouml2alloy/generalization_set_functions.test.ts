import { transformGeneralizationSet, Ontouml2Alloy } from '@libs/ontouml2alloy';
import { Package, Project } from '@libs/ontouml';
import { generateAlloy, generateFact, generateWorldAttribute } from './helpers';
import { Generalization } from '@libs/ontouml';


describe('Generalization Set Functions', () => {

  describe('Should add disjointness and completeness constraints from a GS involving only rigid children classes...', () => {
    
    let project: Project;
    let model: Package;

    beforeEach(() => {
        project = new Project();
        model = project.createModel();
      });
    
    describe ('«kind» Person <|- «subkind» Man, «subkind» Woman', () => {

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
      it('«kind» Person <|- «subkind» Man, «subkind Woman, disjoint - false, complete - true', () => {
      
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
    
    it('«category» Agent <|- «kind» Person, «kind» Organization', () => {
      const parent = model.createCategory('Agent');
      const child1 = model.createKind('Person');
      const child2 = model.createKind('Organization');
      model.createKind('Animal');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const result = generateAlloy(model);
      
      expect(result).toContain(generateFact('rigid',['rigidity[Agent,Object,exists]']))
      expect(result).toContain(generateFact('rigid',['rigidity[Person,Object,exists]']))
      expect(result).toContain(generateFact('rigid',['rigidity[Organization,Object,exists]']))
      expect(result).toContain(generateFact('rigid',['rigidity[Animal,Object,exists]']))

      expect(result).toContain(generateWorldAttribute('Agent','Object'));
      expect(result).toContain(generateWorldAttribute('Person','Object'));
      expect(result).toContain(generateWorldAttribute('Organization','Object'));
      expect(result).toContain(generateWorldAttribute('Animal','Object'));

      expect(result).toContain(generateFact('generalization',['Person in Agent']));
      expect(result).toContain(generateFact('generalization',['Organization in Agent']));
      expect(result).toContain(generateFact('generalizationSet',['disjoint[Person,Organization]']));
      expect(result).not.toContain(generateFact('generalizationSet',['Agent = Person+Organization']));

      expect(result).toContain(generateFact('abstractClass',['all w: World | w.Agent = w.Person+w.Organization']));
    });

    //TODO - interesting case, event classes are not transformed but a generalization & generalization_set is created
    it('«event» Ceremony <|- «event» Wedding, «event» Graduation', () => {
      const model = new Package();
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
      const model = new Package();
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

  describe('Should NOT add disjointness constraint from a disjoint GS involving an antirigid or a semirigid class...', () => {
    // it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
    //   const model = new Package();
    //   const parent = model.createKind('Person');
    //   const child1 = model.createPhase('Child');
    //   const child2 = model.createPhase('Adult');
    //   const gen1 = model.createGeneralization(parent, child1);
    //   const gen2 = model.createGeneralization(parent, child2);
    //   model.createPartition([gen1, gen2]);

    //   const owl = generateGufo(model);
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Child> <:Adult>) .');
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Adult> <:Child>) .');
    // });

    // it('«category» Agent <|- «roleMixin» Customer, «roleMixin» Provider', () => {
    //   const model = new Package();
    //   const parent = model.createCategory('Agent');
    //   const child1 = model.createRoleMixin('Customer');
    //   const child2 = model.createRoleMixin('Provider');
    //   const gen1 = model.createGeneralization(parent, child1);
    //   const gen2 = model.createGeneralization(parent, child2);
    //   model.createPartition([gen1, gen2]);

    //   const owl = generateGufo(model);
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Customer> <:Provider>) .');
    //   expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Provider> <:Customer>) .');
    // });

    // it('«mixin» Insurable <|- «mixin» ExpensiveObject, «category» RareObject', () => {
    //   const model = new Package();
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

});
