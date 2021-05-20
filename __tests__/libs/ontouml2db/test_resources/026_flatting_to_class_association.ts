/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';

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

const scripts: string[] = [scriptPerson, scriptAssociatedClass1, scriptAssociatedClass2,
  scriptAssociatedClass3, scriptAssociatedClass4, scriptPersonassociatedclass1,
  SCRIPTpersonassociatedclass2, scriptFKAssociatedClass3, scriptFKAssociatedClass4,
  scriptAssociated1, scriptAssociated2, scritpAssociatedClass3, acriptAssociatedClass4];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaNamedEntity = 
'mappingId    Test26-NamedEntity'+
'target       :Test26/person/{person_id} a :NamedEntity .'+
'source       SELECT person.person_id '+
'             FROM person ';

const obdaPerson = 
'mappingId    Test26-Person'+
'target       :Test26/person/{person_id} a :Person .'+
'source       SELECT person.person_id '+
'             FROM person ';

const obdaAssociated1 = 
'mappingId    Test26-AssociatedClass1'+
'target       :Test26/associated_class1/{associated_class1_id} a :AssociatedClass1 .'+
'source       SELECT associated_class1.associated_class1_id '+
'             FROM associated_class1 ';

const obdaAssociated2 = 
'mappingId    Test26-AssociatedClass2'+
'target       :Test26/associated_class2/{associated_class2_id} a :AssociatedClass2 .'+
'source       SELECT associated_class2.associated_class2_id '+
'             FROM associated_class2 ';

const obdaAssociated3 = 
'mappingId    Test26-AssociatedClass3'+
'target       :Test26/associated_class3/{person_id} a :AssociatedClass3 ; :hasAssociatedClass3 :Test26/person/{person_id}  .'+
'source       SELECT associated_class3.person_id, associated_class3.person_id '+
'             FROM associated_class3 ';

const obdaAssociated4 = 
'mappingId    Test26-AssociatedClass4'+
'target       :Test26/associated_class4/{person_id} a :AssociatedClass4 ; :hasAssociatedClass4 :Test26/person/{person_id}  .'+
'source       SELECT associated_class4.person_id, associated_class4.person_id '+
'             FROM associated_class4 ';

const obdaAssociated5 = 
'mappingId    Test26-hasAssociatedClass1'+
'target       :Test26/associated_class1/{associated_class1_id} :hasAssociatedClass1 :Test26/person/{person_id}.'+
'source       SELECT person_associated_class1.person_associated_class1_id, person_associated_class1.associated_class1_id, person_associated_class1.person_id '+
'             FROM person_associated_class1 ';

const obdaAssociated6 = 
'mappingId    Test26-personHasAssociatedClass2'+
'target       :Test26/associated_class2/{associated_class2_id} :personHasAssociatedClass2 :Test26/person/{person_id}.'+
'source       SELECT person_associated_class2.person_associated_class2_id, person_associated_class2.associated_class2_id, person_associated_class2.person_id '+
'             FROM person_associated_class2 ';

const obdaMapping: string[] = [obdaNamedEntity, obdaPerson, obdaAssociated1, obdaAssociated2,
  obdaAssociated3, obdaAssociated4, obdaAssociated5, obdaAssociated6];

// ****************************************
//       M O D E L
// ****************************************
const project = new Project();
project.setName('Test26')
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
const relation2 = model.createMediationRelation(namedEntity, assocatedClass2);
relation2.getSourceEnd().cardinality.setOneToMany();
relation2.getTargetEnd().cardinality.setOneToMany();
const relation3 = model.createMediationRelation(namedEntity, assocatedClass3, 'hasAssociatedClass3');
relation3.getSourceEnd().cardinality.setZeroToOne();
relation3.getTargetEnd().cardinality.setZeroToOne();
const relation4 = model.createMediationRelation(namedEntity, assocatedClass4, 'hasAssociatedClass4');
relation4.getSourceEnd().cardinality.setOneToOne();
relation4.getTargetEnd().cardinality.setOneToOne();


// ****************************************
export const test_026: TestResource = {
  title: '026 - Evaluates the cardinality of the association with the superclass in the event of a flattening',
  project,
  scripts,
  obdaMapping,
};
