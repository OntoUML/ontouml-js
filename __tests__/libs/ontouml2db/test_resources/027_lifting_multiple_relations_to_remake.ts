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
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        is_personal_customer    BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('ADULT','CHILD')  NOT NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptFKEmployment = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTest = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_027_lifting_multiple_relations_to_remake = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_personal_customer', false))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('person_id', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .addTracker(new TrackerChecker('Test', 'test'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(2)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTest, 'The TEST table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKEmployment, 'The FK between EMPLOYMENT and PERSON not exists or is different than expected.')
  )
  .addScriptChecker(new ScriptChecker(scriptFKTest, 'The FK between TEST and PERSON not exists or is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
const employee = model.createRole('Employee');
const personalCustomer = model.createRole('PersonalCustomer');
const employment = model.createRelator('Employment');
const test = model.createRelator('Test');
// CREATE GENERALIZATIONS
const genAdult = model.createGeneralization(person, adult);
const genChild = model.createGeneralization(person, child);
model.createGeneralization(adult, employee);
model.createGeneralization(adult, personalCustomer);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genAdult, genChild], disjoint, complete, null, 'LifePhase');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(personalCustomer, test, 'has1');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();
const relation2 = model.createMediationRelation(employee, employment, 'has2');
relation2.getSourceEnd().cardinality.setOneToOne();
relation2.getTargetEnd().cardinality.setOneToMany();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_027: TestResource = {
  title: '027 - Lifting when one subclass has two indirect associations',
  checker: gChecker_027_lifting_multiple_relations_to_remake,
  project,
  options
};
