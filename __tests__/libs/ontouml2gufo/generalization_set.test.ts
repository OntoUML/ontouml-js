import { generateGufo } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('Generalization Sets', () => {
  describe('Should add disjointness constraint from a disjoint GS involving only rigid children classes...', () => {
    it('«kind» Person <|- «subkind» Man, «subkind» Woman', () => {
      const parent = OntoumlFactory.createKind('Person');
      const child1 = OntoumlFactory.createSubkind('Man');
      const child2 = OntoumlFactory.createSubkind('Woman');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createGeneralizationSet('gender', [gen1, gen2], true, false);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Man> <:Woman>) .');
    });

    it('«category» Agent <|- «kind» Person, «kind» Organization', () => {
      const parent = OntoumlFactory.createCategory('Agent');
      const child1 = OntoumlFactory.createKind('Person');
      const child2 = OntoumlFactory.createKind('Organization');
      const child3 = OntoumlFactory.createKind('Animal');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createGeneralizationSet(null, [gen1, gen2], true, false);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, child3, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Person> <:Organization>) .');
    });

    it('«event» Ceremony <|- «event» Wedding, «event» Graduation', () => {
      const parent = OntoumlFactory.createEvent('Ceremony');
      const child1 = OntoumlFactory.createEvent('Wedding');
      const child2 = OntoumlFactory.createEvent('Graduation');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createGeneralizationSet(null, [gen1, gen2], true, false);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Wedding> <:Graduation>) .');
    });

    it('«datatype» Color <|- «datatype» ColorInRgb, «datatype» ColorInHsv', () => {
      const parent = OntoumlFactory.createDatatype('Color');
      const child1 = OntoumlFactory.createDatatype('ColorInRgb');
      const child2 = OntoumlFactory.createDatatype('ColorInHsv');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createGeneralizationSet(null, [gen1, gen2], true, false);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:ColorInRgb> <:ColorInHsv>) .');
    });
  });

  describe('Should NOT add disjointness constraint from a disjoint GS involving an antirigid or a semirigid class...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const parent = OntoumlFactory.createKind('Person');
      const child1 = OntoumlFactory.createPhase('Child');
      const child2 = OntoumlFactory.createPhase('Adult');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createPartition(null, [gen1, gen2]);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Child> <:Adult>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Adult> <:Child>) .');
    });

    it('«category» Agent <|- «roleMixin» Customer, «roleMixin» Provider', () => {
      const parent = OntoumlFactory.createCategory('Agent');
      const child1 = OntoumlFactory.createRoleMixin('Customer');
      const child2 = OntoumlFactory.createRoleMixin('Provider');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createPartition(null, [gen1, gen2]);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Customer> <:Provider>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:Provider> <:Customer>) .');
    });

    it('«mixin» Insurable <|- «mixin» ExpensiveObject, «category» RareObject', () => {
      const parent = OntoumlFactory.createMixin('Insurable');
      const child1 = OntoumlFactory.createMixin('ExpensiveObject');
      const child2 = OntoumlFactory.createCategory('RareObject');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createPartition(null, [gen1, gen2]);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:ExpensiveObject> <:RareObject>) .');
      expect(owl).not.toContain('[ <rdf:type> <owl:AllDisjointClasses> ] <owl:members> (<:RareObject> <:ExpensiveObject>) .');
    });
  });

  describe('Should add an equivalence constraint from a complete GS...', () => {
    it('«kind» Person <|- «phase» Child, «phase» Adult ', () => {
      const parent = OntoumlFactory.createKind('Person');
      const child1 = OntoumlFactory.createPhase('Child');
      const child2 = OntoumlFactory.createPhase('Adult');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createPartition(null, [gen1, gen2]);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('<:Person> <owl:equivalentClass>');
      expect(owl).toContain('<owl:unionOf> (<:Child> <:Adult>)');
    });

    it('«kind» Person <|- «subkind» Man, «subkind» Woman ', () => {
      const parent = OntoumlFactory.createKind('Person');
      const child1 = OntoumlFactory.createSubkind('Man');
      const child2 = OntoumlFactory.createSubkind('Woman');
      const gen1 = OntoumlFactory.createGeneralization(child1, parent);
      const gen2 = OntoumlFactory.createGeneralization(child2, parent);
      const gs = OntoumlFactory.createPartition(null, [gen1, gen2]);
      const pack = OntoumlFactory.createPackage(null, [parent, child1, child2, gen1, gen2, gs]);

      const owl = generateGufo(pack);
      expect(owl).toContain('<:Person> <owl:equivalentClass>');
      expect(owl).toContain('<owl:unionOf> (<:Man> <:Woman>)');
    });
  });
});
