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
  ',        birth_date              DATE           NOT NULL' +
  ',        test                    INTEGER        NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        is_adult                BOOLEAN        NOT NULL DEFAULT FALSE' +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '         employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptFKTestPerson = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_016_lifting_cascade_generalization_association = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test', true))
      .addProperty(new PropertyChecker('is_adult', false))
      .addProperty(new PropertyChecker('is_employee', false))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('salary', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(1)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYEMENT table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKTestPerson, 'The FK between Test and Person not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _int = model.createDatatype('int');
const _double = model.createDatatype('double');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const adult = model.createPhase('Adult');
const employee = model.createRole('Employee');
const employment = model.createRelator('Employment');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
employee.createAttribute(_int, 'test').cardinality.setOneToOne();
employment.createAttribute(_double, 'salary').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
model.createGeneralization(person, adult);
model.createGeneralization(adult, employee);
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(employee, employment, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setOneToMany();

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
export const test_016: TestResource = {
  title: '016 - Lifting with cascading generalizations and one association with the subclass',
  checker: gChecker_016_lifting_cascade_generalization_association,
  project,
  options
};
