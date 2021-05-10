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
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTel =
  'CREATE TABLE IF NOT EXISTS tel ( ' +
  '         tel_id                  INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        tel                     VARCHAR(20)    NOT NULL' +
  '); ';

const scriptAddress =
  'CREATE TABLE IF NOT EXISTS address ( ' +
  '         address_id              INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptFKTel = 'ALTER TABLE tel ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKAddress = 'ALTER TABLE address ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_028_multivalued_property = new GraphChecker()
  .addNode(
    new NodeChecker('person').addProperty(new PropertyChecker('person_id', false)).addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('tel')
      .addProperty(new PropertyChecker('tel_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('tel', false))
  )
  .addNode(
    new NodeChecker('address')
      .addProperty(new PropertyChecker('address_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'tel', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'address', Cardinality.C0_N))
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(2)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTel, 'The TEL table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAddress, 'The ADDRESS table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptFKTel, 'The FK between PERSONT and TEL not exists or is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKAddress, 'The FK between PERSON and ADDRESS not exists or is different than expected.')
  );

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
// CREATE GENERALIZATIONS
model.createGeneralization(namedEntity, person);
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
namedEntity.createAttribute(_string, 'tel').cardinality.setZeroToMany();
person.createAttribute(_string, 'address').cardinality.setOneToMany();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_028: TestResource = {
  title: '028 - Evaluates the multivalued property',
  checker: gChecker_028_multivalued_property,
  project,
  options
};
