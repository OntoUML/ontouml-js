/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Project } from '@libs/ontouml';
import { TestResource } from './TestResource';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  ',        test1                   INTEGER        NULL' +
  ',        test2                   INTEGER        NULL' +
  ",        person_phase_enum       ENUM('CHILD','ADULT')  NOT NULL" +
  '); ';

const scripts: string[] = [scriptPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _int = model.createDatatype('int');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const person = model.createKind('Person');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
// CREATE PROPERTIES
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
child.createAttribute(_int, 'test1').cardinality.setOneToOne();
child.createAttribute(_int, 'test2').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genPersonChild = model.createGeneralization(person, child);
const genPersonAdult = model.createGeneralization(person, adult);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'PersonPhase');


// ****************************************
export const test_015: TestResource = {
  title: '015 - Lifting a generalization set with the attribute name repeated in both subclasses',
  project,
  scripts,
  obdaMapping,
};
