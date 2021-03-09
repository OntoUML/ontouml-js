/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TestResource } from './TestResource';
import { Project } from '@libs/ontouml';
import { ScriptChecker } from './graph_tester/ScriptChecker';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_employee             BIT            NOT NULL DEFAULT FALSE' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  ',        is_personal_customer    BIT            NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT') NOT NULL" +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  ',        playground_size         INTEGER        NULL' +
  ',        capacity                INTEGER        NULL' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_limit            DOUBLE         NULL' +
  ',        is_corporate_customer   BIT            NOT NULL DEFAULT FALSE' +
  ',        is_contractor           BIT            NOT NULL DEFAULT FALSE' +
  ",        organization_type_enum  ENUM('PRIMARYSCHOOL','HOSPITAL')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',       organization_id         INTEGER        NOT NULL' +
  ',       person_id               INTEGER        NOT NULL' +
  ',       salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NOT NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL PRIMARY KEY' +
  ',        organization_customer_id INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        contract_value          DOUBLE         NOT NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ",        nationality_enum        ENUM('BRAZILIANCITIZEN','ITALIANCITIZEN')  NOT NULL" +
  '); ';

const scriptFKEmploymentOrganization =
  'ALTER TABLE employment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scriptFKEmploymentPerson = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKEnrollmentOrganization =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scritpFKEnrollmentPerson = 'ALTER TABLE enrollment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKSupplyOrganizationCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_customer_id ) REFERENCES organization ( organization_id )';

const scriptFKSupplyPerson = 'ALTER TABLE supply_contract ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKSupplyOrganization =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scriptFKNationalityPerson = 'ALTER TABLE nationality ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_run_example = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('rg', true))
      .addProperty(new PropertyChecker('ci', true))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_personal_customer', false))
      .addProperty(new PropertyChecker('credit_rating', true))
      .addProperty(new PropertyChecker('credit_card', true))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false))
      .addProperty(new PropertyChecker('is_corporate_customer', false))
      .addProperty(new PropertyChecker('credit_rating', true))
      .addProperty(new PropertyChecker('credit_limit', true))
      .addProperty(new PropertyChecker('is_contractor', false))
      .addProperty(new PropertyChecker('playground_size', true))
      .addProperty(new PropertyChecker('capacity', true))
      .addProperty(new PropertyChecker('organization_type_enum', true, ['PRIMARYSCHOOL', 'HOSPITAL']))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('salary', false))
  )
  .addNode(
    new NodeChecker('supply_contract')
      .addProperty(new PropertyChecker('supply_contract_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('organization_customer_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('contract_value', false))
  )
  .addNode(
    new NodeChecker('enrollment')
      .addProperty(new PropertyChecker('enrollment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('grade', false))
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('nationality_enum', false, ['BRAZILIANCITIZEN', 'ITALIANCITIZEN']))
  )
  .addRelationship(new RelationshipChecker('nationality', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('enrollment', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('employment', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('supply_contract', Cardinality.C0_N, 'person', Cardinality.C0_1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'supply_contract', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C0_1, 'supply_contract', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'enrollment', Cardinality.C0_N))

  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'))
  .addTracker(new TrackerChecker('Customer', 'person'))
  .addTracker(new TrackerChecker('Customer', 'organization'))
  .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
  .addTracker(new TrackerChecker('CorporateCustomer', 'organization'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .addTracker(new TrackerChecker('SupplyContract', 'supply_contract'))
  .addTracker(new TrackerChecker('Contractor', 'organization'))
  .addTracker(new TrackerChecker('PrimarySchool', 'organization'))
  .addTracker(new TrackerChecker('Hospital', 'organization'))
  .addTracker(new TrackerChecker('Enrollment', 'enrollment'))
  .setNumberOfTablesToFindInScript(6)
  .setNumberOfFkToFindInScript(8)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEnrollment, 'The ENROLLMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptSupply, 'The SUPPLY_CONTRACT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptNationality, 'The Nationality table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEmploymentOrganization,
      'The FK between Employment and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKEmploymentPerson, 'The FK between Employment and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEnrollmentOrganization,
      'The FK between Enrollment and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scritpFKEnrollmentPerson, 'The FK between Enrollment and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyOrganizationCustomer,
      'The FK between SupplyContract and Organization like Customer not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKSupplyPerson, 'The FK between SupplyContract and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyOrganization,
      'The FK between SupplyContract and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKNationalityPerson,
      'The FK between Nationality and Person not exists or is different than expected.'
    )
  );

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlappig = false;
const complete = true;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
const _int = model.createDatatype('int');
const _double = model.createDatatype('double');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const customer = model.createRoleMixin('Customer');
const person = model.createKind('Person');
const organization = model.createKind('Organization');
const primarySchool = model.createSubkind('PrimarySchool');
const hospital = model.createSubkind('Hospital');
const brazilianCitizen = model.createRole('BrazilianCitizen');
const italianCitizen = model.createRole('ItalianCitizen');
const employee = model.createRole('Employee');
const personalCustomer = model.createRole('PersonalCustomer');
const corporateCustomer = model.createRole('CorporateCustomer');
const contractor = model.createRole('Contractor');
const child = model.createPhase('Child');
const adult = model.createPhase('Adult');
const employment = model.createRelator('Employment');
const enrollment = model.createRelator('Enrollment');
const supplyConstract = model.createRelator('SupplyContract');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
brazilianCitizen.createAttribute(_string, 'RG').cardinality.setOneToOne();
italianCitizen.createAttribute(_string, 'CI').cardinality.setOneToOne();
customer.createAttribute(_double, 'creditRating').cardinality.setOneToOne();
personalCustomer.createAttribute(_string, 'creditCard').cardinality.setZeroToOne();
corporateCustomer.createAttribute(_double, 'creditLimit').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
primarySchool.createAttribute(_int, 'playgroundSize').cardinality.setZeroToOne();
hospital.createAttribute(_int, 'capacity').cardinality.setZeroToOne();
employment.createAttribute(_double, 'salary').cardinality.setOneToOne();
enrollment.createAttribute(_int, 'grade').cardinality.setOneToOne();
supplyConstract.createAttribute(_double, 'contractValue').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
const genPersonBrazilian = model.createGeneralization(person, brazilianCitizen);
const genPersonItalian = model.createGeneralization(person, italianCitizen);
const genPersonChild = model.createGeneralization(person, child);
const genPersonAdult = model.createGeneralization(person, adult);
const genCustomerPersonal = model.createGeneralization(customer, personalCustomer);
const genCustomerCorporate = model.createGeneralization(customer, corporateCustomer);
const genOrganizationPrimary = model.createGeneralization(organization, primarySchool);
const genOrganizationHospital = model.createGeneralization(organization, hospital);
model.createGeneralization(organization, contractor);
model.createGeneralization(adult, employee);
model.createGeneralization(adult, personalCustomer);
model.createGeneralization(organization, corporateCustomer);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
model.createGeneralizationSet([genPersonBrazilian, genPersonItalian], overlappig, incomplete, null, 'Nationality');
model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'LifePhase');
model.createGeneralizationSet([genCustomerPersonal, genCustomerCorporate], disjoint, complete, null, 'CustomerType');
model.createGeneralizationSet([genOrganizationPrimary, genOrganizationHospital], disjoint, incomplete, null, 'OrganizationType');
// CREATE ASSOCIATIONS
model.createMediationRelation(employment, employee, 'hasEmployee');
model.createMediationRelation(employment, organization, 'hasOrganization');
model.createMediationRelation(enrollment, child, 'hasChild');
model.createMediationRelation(enrollment, primarySchool, 'hasPrimarySchool');
model.createMediationRelation(supplyConstract, contractor, 'hasContractor');
model.createMediationRelation(supplyConstract, customer, 'hasCustomer');

// ****************************************

export const baseExample: TestResource = {
  title: 'Base Example Test',
  checker: gChecker_run_example,
  project
};
