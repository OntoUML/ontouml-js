import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Generalization Sets', () => {
  describe('Should add disjointness constraint from a disjoint GS involving only rigid children classes...', () => {
    it('«kind» Person <|- «subkind» Man, «subkind» Woman', () => {
      const model = new Package();
      const parent = model.createKind('Person');
      const child1 = model.createSubkind('Man');
      const child2 = model.createSubkind('Woman');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const owl = generateGufo(model);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Man> <:Woman>) .');
    });

    it('«category» Agent <|- «kind» Person, «kind» Organization', () => {
      const model = new Package();
      const parent = model.createCategory('Agent');
      const child1 = model.createKind('Person');
      const child2 = model.createKind('Organization');
      model.createKind('Animal');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const owl = generateGufo(model);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Person> <:Organization>) .');
    });

    it('«event» Ceremony <|- «event» Wedding, «event» Graduation', () => {
      const model = new Package();
      const parent = model.createEvent('Ceremony');
      const child1 = model.createEvent('Wedding');
      const child2 = model.createEvent('Graduation');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const owl = generateGufo(model);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Wedding> <:Graduation>) .');
    });

    it('«datatype» Color <|- «datatype» ColorInRgb, «datatype» ColorInHsv', () => {
      const model = new Package();
      const parent = model.createDatatype('Color');
      const child1 = model.createDatatype('ColorInRgb');
      const child2 = model.createDatatype('ColorInHsv');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createGeneralizationSet([gen1, gen2], true, false);

      const owl = generateGufo(model);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:ColorInRgb> <:ColorInHsv>) .');
    });
  });

  describe('Should NOT add disjointness constraint from a disjoint GS involving an antirigid or a semirigid class...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const model = new Package();
      const parent = model.createKind('Person');
      const child1 = model.createPhase('Child');
      const child2 = model.createPhase('Adult');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const owl = generateGufo(model);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Child> <:Adult>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Adult> <:Child>) .');
    });

    it('«category» Agent <|- «roleMixin» Customer, «roleMixin» Provider', () => {
      const model = new Package();
      const parent = model.createCategory('Agent');
      const child1 = model.createRoleMixin('Customer');
      const child2 = model.createRoleMixin('Provider');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const owl = generateGufo(model);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Customer> <:Provider>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Provider> <:Customer>) .');
    });

    it('«mixin» Insurable <|- «mixin» ExpensiveObject, «category» RareObject', () => {
      const model = new Package();
      const parent = model.createMixin('Insurable');
      const child1 = model.createMixin('ExpensiveObject');
      const child2 = model.createCategory('RareObject');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const owl = generateGufo(model);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:ExpensiveObject> <:RareObject>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:RareObject> <:ExpensiveObject>) .');
    });
  });

  describe('Should add an equivalence constraint from a complete GS...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const model = new Package();
      const parent = model.createKind('Person');
      const child1 = model.createPhase('Child');
      const child2 = model.createPhase('Adult');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const owl = generateGufo(model);
      expect(owl).toContain('<:Person> <owl:equivalentClass>');
      expect(owl).toContain('<owl:unionOf> (<:Child> <:Adult>)');
    });

    it('«kind» Person <|- «subkind» Man, «subkind» Woman ', () => {
      const model = new Package();
      const parent = model.createKind('Person');
      const child1 = model.createSubkind('Man');
      const child2 = model.createSubkind('Woman');
      const gen1 = model.createGeneralization(parent, child1);
      const gen2 = model.createGeneralization(parent, child2);
      model.createPartition([gen1, gen2]);

      const owl = generateGufo(model);
      expect(owl).toContain('<:Person> <owl:equivalentClass>');
      expect(owl).toContain('<owl:unionOf> (<:Man> <:Woman>)');
    });
  });
});
