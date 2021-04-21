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
  '          person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  '); ';

const scriptAssociatedClass1 =
  'CREATE TABLE IF NOT EXISTS associated_class1 ( ' +
  '          associated_class1_id    INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  '); ';

const scriptAssociatedClass2 =
  'CREATE TABLE IF NOT EXISTS associated_class2 ( ' +
  '          associated_class2_id    INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  '); ';

const scriptAssociatedClass3 =
  'CREATE TABLE IF NOT EXISTS associated_class3 ( ' +
  '          person_id               INTEGER        NOT NULL PRIMARY KEY' +
  '); ';

const scriptAssociatedClass4 =
  'CREATE TABLE IF NOT EXISTS associated_class4 ( ' +
  '          person_id               INTEGER        NOT NULL PRIMARY KEY' +
  '); ';

const scriptPersonassociatedclass1 =
  'CREATE TABLE IF NOT EXISTS person_associated_class1 ( ' +
  '         person_associated_class1_id INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        associated_class1_id    INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const SCRIPTpersonassociatedclass2 =
  'CREATE TABLE IF NOT EXISTS person_associated_class2 ( ' +
  '         person_associated_class2_id INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        associated_class2_id    INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  '); ';

const scriptFKAssociatedClass3 = 'ALTER TABLE associated_class3 ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKAssociatedClass4 = 'ALTER TABLE associated_class4 ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptAssociated1 =
  'ALTER TABLE person_associated_class1 ADD FOREIGN KEY ( associated_class1_id ) REFERENCES associated_class1 ( associated_class1_id );';

const scriptAssociated2 = 'ALTER TABLE person_associated_class1 ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scritpAssociatedClass3 =
  'ALTER TABLE person_associated_class2 ADD FOREIGN KEY ( associated_class2_id ) REFERENCES associated_class2 ( associated_class2_id );';

const acriptAssociatedClass4 =
  'ALTER TABLE person_associated_class2 ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_026_flatting_to_class_association = new GraphChecker()
  .addNode(new NodeChecker('person').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('associated_class1').addProperty(new PropertyChecker('associated_class1_id', false)))
  .addNode(new NodeChecker('associated_class2').addProperty(new PropertyChecker('associated_class2_id', false)))
  .addNode(new NodeChecker('associated_class3').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('associated_class4').addProperty(new PropertyChecker('person_id', false)))
  .addNode(
    new NodeChecker('person_associated_class1')
      .addProperty(new PropertyChecker('person_associated_class1_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('associated_class1_id', false))
  )
  .addNode(
    new NodeChecker('person_associated_class2')
      .addProperty(new PropertyChecker('person_associated_class2_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('associated_class2_id', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'person_associated_class1', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'person_associated_class2', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'associated_class3', Cardinality.C0_1))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'associated_class4', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person_associated_class1', Cardinality.C0_N, 'associated_class1', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person_associated_class2', Cardinality.C0_N, 'associated_class2', Cardinality.C1))
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('AssociatedClass1', 'associated_class1'))
  .addTracker(new TrackerChecker('AssociatedClass2', 'associated_class2'))
  .addTracker(new TrackerChecker('AssociatedClass3', 'associated_class3'))
  .addTracker(new TrackerChecker('AssociatedClass4', 'associated_class4'))
  .addTracker(new TrackerChecker('PersonAssociatedClass1', 'person_associated_class1'))
  .addTracker(new TrackerChecker('PersonAssociatedClass2', 'person_associated_class2'))
  .setNumberOfTablesToFindInScript(7)
  .setNumberOfFkToFindInScript(6)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass1, 'The ASSOCIATED_CLASS1 table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass2, 'The ASSOCIATED_CLASS2 table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass3, 'The ASSOCIATED_CLASS3 table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAssociatedClass4, 'The ASSOCIATED_CLASS4 table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptPersonassociatedclass1, 'The PERSON_ASSOCIATED_CLASS1 table is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(SCRIPTpersonassociatedclass2, 'The PERSON_ASSOCIATED_CLASS2 table is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKAssociatedClass3,
      'The FK between ASSOCIATED_CLASS3 and PERSON not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKAssociatedClass4,
      'The FK between ASSOCIATED_CLASS4 and PERSON not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptAssociated1,
      'The FK between PERSON_ASSOCIATED_CLASS1 and ASSOCIATED_CLASS1 not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptAssociated2,
      'The FK between PERSON_ASSOCIATED_CLASS1 and PERSON not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scritpAssociatedClass3,
      'The FK between PERSON_ASSOCIATED_CLASS2 and ASSOCIATED_CLASS2 not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      acriptAssociatedClass4,
      'The FK between PERSON_ASSOCIATED_CLASS2 and PERSON not exists or is different than expected.'
    )
  );

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
const model = project.createModel();
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
const assocatedClass1 = model.createKind('AssociatedClass1');
const assocatedClass2 = model.createKind('AssociatedClass2');
const assocatedClass3 = model.createKind('AssociatedClass3');
const assocatedClass4 = model.createKind('AssociatedClass4');
// CREATE GENERALIZATIONS
model.createGeneralization(namedEntity, person);
// CREATE ASSOCIATIONS
const relation1 = model.createMediationRelation(namedEntity, assocatedClass1, 'hasAssociatedClass1');
relation1.getSourceEnd().cardinality.setZeroToMany();
relation1.getTargetEnd().cardinality.setZeroToMany();
const relation2 = model.createMediationRelation(namedEntity, assocatedClass2, 'hasAssociatedClass2');
relation2.getSourceEnd().cardinality.setOneToMany();
relation2.getTargetEnd().cardinality.setOneToMany();
const relation3 = model.createMediationRelation(namedEntity, assocatedClass3, 'hasAssociatedClass3');
relation3.getSourceEnd().cardinality.setZeroToOne();
relation3.getTargetEnd().cardinality.setZeroToOne();
const relation4 = model.createMediationRelation(namedEntity, assocatedClass4, 'hasAssociatedClass4');
relation4.getSourceEnd().cardinality.setOneToOne();
relation4.getTargetEnd().cardinality.setOneToOne();

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
export const test_026: TestResource = {
  title: '026 - Evaluates the cardinality of the association with the superclass in the event of a flattening',
  checker: gChecker_026_flatting_to_class_association,
  project,
  options
};
