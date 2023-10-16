import { Class, Relation, Project } from '../../src';

describe('Class: test ancestor-related query methods', () => {
  let proj: Project;
  let thing: Class,
    agent: Class,
    person: Class,
    student: Class,
    researcher: Class,
    phdStudent: Class;

  beforeEach(() => {
    proj = new Project();
    thing = proj.classBuilder().mixin().build();
    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    student = proj.classBuilder().role().build();
    researcher = proj.classBuilder().role().build();
    phdStudent = proj.classBuilder().role().build();
    agent.addParent(thing);
    person.addParent(agent);
    student.addParent(person);
    researcher.addParent(person);
    phdStudent.addParent(student);
    phdStudent.addParent(researcher);
  });

  describe(`Test ${Class.prototype.getParents.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const x = `:c1 a ontouml:Class . 
                 :c2 a ontouml:Class . 
                 :g a ontouml:Generalization ; 
                    ontouml:specific :c1 ; +
                    ontouml:general :c2 . `;

      const parents = thing.getParents();
      expect(parents).toBeEmpty();
    });

    it('should return «mixin» thing as the only parent of «category» agent', () => {
      const parents = agent.getParents();
      expect(parents).toBeArrayOfSize(1);
      expect(parents).toIncludeSameMembers([thing]);
    });

    it('should return «category» agent as the only parent of «kind» person', () => {
      const parents = person.getParents();
      expect(parents).toBeArrayOfSize(1);
      expect(parents).toIncludeSameMembers([agent]);
    });

    it('should return «kind» person as the only parent of «role» student', () => {
      const parents = student.getParents();
      expect(parents).toBeArrayOfSize(1);
      expect(parents).toIncludeSameMembers([person]);
    });

    it('should return «kind» person as the only parent of «role» researcher', () => {
      const parents = researcher.getParents();
      expect(parents).toBeArrayOfSize(1);
      expect(parents).toIncludeSameMembers([person]);
    });

    it('should return «role» researcher and «role» student as the parents of «role» phdStudent', () => {
      const parents = phdStudent.getParents();
      expect(parents).toBeArrayOfSize(2);
      expect(parents).toIncludeSameMembers([student, researcher]);
    });
  });

  describe(`Test ${Class.prototype.getAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «mixin» thing as the only anscestor of «category» agent', () => {
      const ancestors = agent.getAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «category» agent as the only anscestor of «kind» person', () => {
      const ancestors = person.getAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, thing]);
    });

    it('should return «category» agent and «kind» person as the anscestors of «role» student', () => {
      const ancestors = student.getAncestors();
      expect(ancestors).toBeArrayOfSize(3);
      expect(ancestors).toIncludeSameMembers([person, agent, thing]);
    });

    it('should return «category» agent and «kind» person as the anscestors of «role» researcher', () => {
      const ancestors = researcher.getAncestors();
      expect(ancestors).toBeArrayOfSize(3);
      expect(ancestors).toIncludeSameMembers([person, agent, thing]);
    });

    it('should return «category» agent, «kind» person, «role» researcher, and «role» student as the ancestors of «role» phdStudent', () => {
      const ancestors = phdStudent.getAncestors();
      expect(ancestors).toBeArrayOfSize(5);
      expect(ancestors).toIncludeSameMembers([
        agent,
        student,
        researcher,
        person,
        thing
      ]);
    });
  });

  describe(`Test ${Class.prototype.getIdentityProviderAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getIdentityProviderAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «category» agent', () => {
      const ancestors = agent.getIdentityProviderAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «kind» person', () => {
      const ancestors = person.getIdentityProviderAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «kind» person as the only identity provider anscestor of «role» student', () => {
      const ancestors = student.getIdentityProviderAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([person]);
    });

    it('should return «kind» person as the only identity provider anscestor of «role» researcher', () => {
      const ancestors = researcher.getIdentityProviderAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([person]);
    });

    it('should return «kind» person as the only identity provider anscestor of «role» phdStudent', () => {
      const ancestors = phdStudent.getIdentityProviderAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([person]);
    });
  });

  describe(`Test ${Class.prototype.getSortalAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «category» agent', () => {
      const ancestors = agent.getSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «kind» person', () => {
      const ancestors = person.getSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «kind» person as the only sortal anscestor of «role» student', () => {
      const ancestors = student.getSortalAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([person]);
    });

    it('should return «kind» person as the only sortal anscestor of «role» researcher', () => {
      const ancestors = researcher.getSortalAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([person]);
    });

    it('should return «kind» person, «role» researcher, and «role» student as the sortal anscestors of «role» phdStudent', () => {
      const ancestors = phdStudent.getSortalAncestors();
      expect(ancestors).toBeArrayOfSize(3);
      expect(ancestors).toIncludeSameMembers([person, student, researcher]);
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getBaseSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «category» agent', () => {
      const ancestors = agent.getBaseSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «kind» person', () => {
      const ancestors = person.getBaseSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «role» student', () => {
      const ancestors = student.getBaseSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «role» researcher', () => {
      const ancestors = researcher.getBaseSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «role» researcher and «role» student as the base sortal anscestors of «role» phdStudent', () => {
      const ancestors = phdStudent.getBaseSortalAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([student, researcher]);
    });
  });

  describe(`Test ${Class.prototype.getNonSortalAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getNonSortalAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «mixin» thing as the only non-sortal ancestor of  «category» agent', () => {
      const ancestors = agent.getNonSortalAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «category» agent as the only non-sortal ancestor of «kind» person', () => {
      const ancestors = person.getNonSortalAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, thing]);
    });

    it('should return «category» agent as the only non-sortal ancestor of «role» student', () => {
      const ancestors = student.getNonSortalAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, thing]);
    });

    it('should return «category» agent as the only non-sortal ancestor of «role» researcher', () => {
      const ancestors = researcher.getNonSortalAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, thing]);
    });

    it('should return «category» agent as the only non-sortal ancestor of «role» phdStudent', () => {
      const ancestors = phdStudent.getNonSortalAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, thing]);
    });
  });

  describe(`Test ${Class.prototype.getRigidAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «category» agent', () => {
      const ancestors = agent.getRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «category» agent as the only rigid ancestor of «kind» person', () => {
      const ancestors = person.getRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([agent]);
    });

    it('should return «category» agent and «kind» person as the rigid ancestors of «role» student', () => {
      const ancestors = student.getRigidAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, person]);
    });

    it('should return «category» agent and «kind» person as the rigid ancestors of «role» researcher', () => {
      const ancestors = researcher.getRigidAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, person]);
    });

    it('should return «category» agent and «kind» person as the rigid ancestors of «role» phdStudent', () => {
      const ancestors = phdStudent.getRigidAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([agent, person]);
    });
  });

  describe(`Test ${Class.prototype.getSemiRigidAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getSemiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «mixin» thing as the semi-rigid ancestor of «category» agent', () => {
      const ancestors = agent.getSemiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «mixin» thing as the semi-rigid ancestor of «kind» person', () => {
      const ancestors = person.getSemiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «mixin» thing as the semi-rigid ancestor of «role» student', () => {
      const ancestors = student.getSemiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «mixin» thing as the semi-rigid ancestor of «role» researcher', () => {
      const ancestors = researcher.getSemiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });

    it('should return «mixin» thing as the semi-rigid ancestor of «role» phdStudent', () => {
      const ancestors = phdStudent.getSemiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(1);
      expect(ancestors).toIncludeSameMembers([thing]);
    });
  });

  describe(`Test ${Class.prototype.getAntiRigidAncestors.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const ancestors = thing.getAntiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «category» agent', () => {
      const ancestors = agent.getAntiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «kind» person', () => {
      const ancestors = person.getAntiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «role» student', () => {
      const ancestors = student.getAntiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return an empty array for «role» researcher', () => {
      const ancestors = researcher.getAntiRigidAncestors();
      expect(ancestors).toBeEmpty();
    });

    it('should return «role» researcher and «role» student as the anti-rigid ancestors of «role» phdStudent', () => {
      const ancestors = phdStudent.getAntiRigidAncestors();
      expect(ancestors).toBeArrayOfSize(2);
      expect(ancestors).toIncludeSameMembers([researcher, student]);
    });
  });
});

describe('Relation: test ancestor-related query methods', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();

  const knows = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const friendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const bestFriendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  proj.generalizationBuilder().general(knows).specific(friendOf).build();
  proj.generalizationBuilder().general(friendOf).specific(bestFriendOf).build();

  describe('Test getParents()', () => {
    let parents;

    it('should return [ friendOf ] for bestFriendOf', () => {
      parents = bestFriendOf.getParents();
      expect(parents).toIncludeSameMembers([friendOf]);
    });

    it('should return [ knows ] for friendOf', () => {
      parents = friendOf.getParents();
      expect(parents).toIncludeSameMembers([knows]);
    });

    it('should return [ ] for knows', () => {
      parents = knows.getParents();
      expect(parents).toBeEmpty();
    });
  });

  describe('Test getAncestors()', () => {
    let ancestors;

    it('should return [ friendOf, knows ] for bestFriendOf', () => {
      ancestors = bestFriendOf.getAncestors();
      expect(ancestors).toIncludeSameMembers([friendOf, knows]);
    });

    it('should return [ knows ] for friendOf', () => {
      ancestors = friendOf.getAncestors();
      expect(ancestors).toIncludeSameMembers([knows]);
    });

    it('should return [ ] for knows', () => {
      ancestors = knows.getAncestors();
      expect(ancestors).toBeEmpty();
    });
  });
});
