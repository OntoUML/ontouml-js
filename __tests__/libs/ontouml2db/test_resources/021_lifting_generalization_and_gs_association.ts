/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { Project } from '@libs/ontouml';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        is_test1                BIT            NOT NULL DEFAULT FALSE' +
  ',        test2                   INTEGER        NULL' +
  ',        is_test2                BIT            NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','TEENAGER','ADULT')  NOT NULL" +
  '); ';

const scriptEmploymentA =
  'CREATE TABLE employment_a ( ' +
  '         employment_a_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptEmploymentB = 'CREATE TABLE employment_b ( ';
'employment_b_id         INTEGER        NOT NULL PRIMARY KEY';
',        person_id               INTEGER        NOT NULL';
'); ';

const scriptFKA = 'ALTER TABLE employment_a ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKB = 'ALTER TABLE employment_b ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_021_lifting_generalization_and_gs_association = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
      .addProperty(new PropertyChecker('is_test1', false))
      .addProperty(new PropertyChecker('is_test2', false))
      .addProperty(new PropertyChecker('test2', true))
  )
  .addNode(
    new NodeChecker('employment_a')
      .addProperty(new PropertyChecker('employment_a_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addNode(
    new NodeChecker('employment_b')
      .addProperty(new PropertyChecker('employment_b_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment_a', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment_b', Cardinality.C0_N))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Test1', 'person'))
  .addTracker(new TrackerChecker('Test2', 'person'))
  .addTracker(new TrackerChecker('EmploymentA', 'employment_a'))
  .addTracker(new TrackerChecker('EmploymentB', 'employment_b'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(2)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmploymentA, 'The EMPLOYMENT_A table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmploymentB, 'The EMPLOYMENT_B table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKA, 'The FK between PERSON and EMPLOYMENT_A not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKB, 'The FK between PERSON and EMPLOYMENT_B not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlapping = false;
const complete = true;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _int = model.createDatatype('int');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const teenager = model.createPhase('Teenager');
const adult = model.createPhase('Adult');
const test1 = model.createRole('Test1');
const test2 = model.createRole('Test2');
const employmentA = model.createRelator('EmploymentA');
const employmentB = model.createRelator('EmploymentB');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
test2.createAttribute(_int, 'test2').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, test1);
model.createGeneralization(person, test2);
const genChild = model.createGeneralization(person, child);
const genTeenager = model.createGeneralization(person, teenager);
const genAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genChild, genTeenager, genAdult], disjoint, complete, null, 'LifePhase');
// CREATE ASSOCIATINS
const relationA = model.createMediationRelation(adult, employmentA, 'has');
relationA.getSourceEnd().cardinality.setOneToOne();
relationA.getTargetEnd().cardinality.setZeroToMany();
const relationB = model.createMediationRelation(test2, employmentB, 'has');
relationB.getSourceEnd().cardinality.setOneToOne();
relationB.getTargetEnd().cardinality.setZeroToMany();

// ****************************************
export const test_021: TestResource = {
  title: '021 - Lifting with generalizations, one generalization set and association in the subclasses',
  checker: gChecker_021_lifting_generalization_and_gs_association,
  project
};
