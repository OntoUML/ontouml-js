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
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_employee             BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  ',        is_personal_customer    BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT') NOT NULL" +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  ',        playground_size         INTEGER        NULL' +
  ',        capacity                INTEGER        NULL' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_limit            DOUBLE         NULL' +
  ',        is_corporate_customer   BOOLEAN        NOT NULL DEFAULT FALSE' +
  ',        is_contractor           BOOLEAN        NOT NULL DEFAULT FALSE' +
  ",        organization_type_enum  ENUM('PRIMARYSCHOOL','HOSPITAL')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '        employment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',       organization_id         INTEGER        NOT NULL' +
  ',       person_id               INTEGER        NOT NULL' +
  ',       salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE IF NOT EXISTS enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NOT NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE IF NOT EXISTS supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_customer_id INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        contract_value          DOUBLE         NOT NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE IF NOT EXISTS nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
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

const scripts: string[] = [scriptPerson, scriptOrganization, scriptEmployment, scriptEnrollment,
  scriptSupply, scriptNationality, scriptFKEmploymentOrganization, scriptFKEmploymentPerson,
  scriptFKEnrollmentOrganization, scritpFKEnrollmentPerson, scriptFKSupplyOrganizationCustomer,
  scriptFKSupplyPerson, scriptFKSupplyOrganization, scriptFKNationalityPerson];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************

const obdaNamedEntity = 
'mappingId    RunExample-NamedEntity'+
'target       :RunExample/person/{person_id} a :NamedEntity ; :name {name}^^xsd:string .'+
'source       SELECT person.person_id, person.name '+
'             FROM person ';

const obdaNamedEntity52 = 
'mappingId    RunExample-NamedEntity40'+
'target       :RunExample/organization/{organization_id} a :NamedEntity ; :name {name}^^xsd:string   .'+
'source       SELECT organization.organization_id, organization.name '+
'             FROM organization ';

const obdaCustomer = 
'mappingId    RunExample-Customer'+
'target       :RunExample/organization/{organization_id} a :Customer ; :creditRating {credit_rating}^^xsd:decimal .'+
'source       SELECT organization.organization_id, organization.credit_rating '+
'             FROM organization '+
'             WHERE is_corporate_customer = TRUE ';

const obdaCustomer2 = 
'mappingId    RunExample-Customer41'+
'target       :RunExample/person/{person_id} a :Customer ; :creditRating {credit_rating}^^xsd:decimal  .'+
'source       SELECT person.person_id, person.credit_rating '+
'             FROM person '+
'             WHERE is_personal_customer = TRUE ';

const obdaPerson = 
'mappingId    RunExample-Person'+
'target       :RunExample/person/{person_id} a :Person ; :birthDate {birth_date}^^xsd:dateTime .'+
'source       SELECT person.person_id, person.birth_date'+
'             FROM person ';

const obdaOrganization = 
'mappingId    RunExample-Organization'+
'target       :RunExample/organization/{organization_id} a :Organization ; :address {address}^^xsd:string .'+
'source       SELECT organization.organization_id, organization.address'+
'             FROM organization ';

const obdaSchool = 
'mappingId    RunExample-PrimarySchool'+ 
'target       :RunExample/organization/{organization_id} a :PrimarySchool ; :playgroundSize {playground_size}^^xsd:int .'+
'source       SELECT organization.organization_id, organization.playground_size'+
'             FROM organization '+
"             WHERE organization_type_enum = 'PRIMARYSCHOOL' ";

const obdaHospital = 
'mappingId    RunExample-Hospital'+
'target       :RunExample/organization/{organization_id} a :Hospital ; :capacity {capacity}^^xsd:int .'+
'source       SELECT organization.organization_id, organization.capacity '+
'             FROM organization '+
"              WHERE organization_type_enum = 'HOSPITAL' ";

const obdaBrazilian = 
'mappingId    RunExample-BrazilianCitizen'+
'target       :RunExample/person/{person_id} a :BrazilianCitizen ; :RG {rg}^^xsd:string .'+
'source       SELECT person.person_id, person.rg '+
'             FROM person '+
'             INNER JOIN nationality'+
'                      ON person.person_id = nationality.person_id'+
"                      AND nationality.nationality_enum = 'BRAZILIANCITIZEN' ";

const obdaItalian = 
'mappingId    RunExample-ItalianCitizen'+
'target       :RunExample/person/{person_id} a :ItalianCitizen ; :CI {ci}^^xsd:string .'+
'source       SELECT person.person_id, person.ci'+
'             FROM person '+
'             INNER JOIN nationality'+
'                      ON person.person_id = nationality.person_id'+
"                      AND nationality.nationality_enum = 'ITALIANCITIZEN' ";

const obdaEmployee = 
'mappingId    RunExample-Employee'+
'target       :RunExample/person/{person_id} a :Employee .'+
'source       SELECT person.person_id '+
'             FROM person '+
'             WHERE is_employee = TRUE '+
"             AND   life_phase_enum = 'ADULT'" ;

const obdaPersonal = 
'mappingId    RunExample-PersonalCustomer'+
'target       :RunExample/person/{person_id} a :PersonalCustomer ; :creditCard {credit_card}^^xsd:string .'+
'source       SELECT person.person_id, person.credit_card'+
'             FROM person '+
'             WHERE is_personal_customer = TRUE '+
"             AND   life_phase_enum = 'ADULT' ";

const obdaCorporate = 
'mappingId    RunExample-CorporateCustomer'+
'target       :RunExample/organization/{organization_id} a :CorporateCustomer ; :creditLimit {credit_limit}^^xsd:decimal .'+
'source       SELECT organization.organization_id, organization.credit_limit'+
'             FROM organization '+
'             WHERE is_corporate_customer = TRUE ';

const obdaContractor = 
'mappingId    RunExample-Contractor'+
'target       :RunExample/organization/{organization_id} a :Contractor .'+
'source       SELECT organization.organization_id'+
'             FROM organization '+
'             WHERE is_contractor = TRUE ';

const obdaChild = 
'mappingId    RunExample-Child'+
'target       :RunExample/person/{person_id} a :Child .'+
'source       SELECT person.person_id'+
'             FROM person '+
"             WHERE life_phase_enum = 'CHILD' ";

const obdaAdult = 
'mappingId    RunExample-Adult'+
'target       :RunExample/person/{person_id} a :Adult .'+
'source       SELECT person.person_id'+
'             FROM person '+
"             WHERE life_phase_enum = 'ADULT'" ;

const obdaEmployment = 
'mappingId    RunExample-Employment'+
'target       :RunExample/employment/{employment_id} a :Employment ; :salary {salary}^^xsd:decimal ; :hasOrganization :RunExample/organization/{organization_id}  ; :hasEmployee :RunExample/person/{person_id}  .'+
'source       SELECT employment.employment_id, employment.salary, employment.organization_id, employment.person_id '+
'             FROM employment ';

const obdaEnrollment = 
'mappingId    RunExample-Enrollment'+
'target       :RunExample/enrollment/{enrollment_id} a :Enrollment ; :grade {grade}^^xsd:int ; :hasPrimarySchool :RunExample/organization/{organization_id}  ; :hasChild :RunExample/person/{person_id}  .'+
'source       SELECT enrollment.enrollment_id, enrollment.grade, enrollment.organization_id, enrollment.person_id '+
'             FROM enrollment ';

const abdaContract = 
'mappingId    RunExample-SupplyContract'+
'target       :RunExample/supply_contract/{supply_contract_id} a :SupplyContract ; :contractValue {contract_value}^^xsd:decimal ; :hasCustomer :RunExample/organization/{organization_customer_id}  ; :hasCustomer :RunExample/person/{person_id}  ; :hasContractor :RunExample/organization/{organization_id}  .'+
'source       SELECT supply_contract.supply_contract_id, supply_contract.contract_value, supply_contract.organization_customer_id, supply_contract.person_id, supply_contract.organization_id '+
'             FROM supply_contract ';


const obdaMapping: string[] = [obdaNamedEntity, obdaNamedEntity52, obdaCustomer, obdaCustomer2, obdaPerson, 
  obdaOrganization, obdaSchool, obdaHospital, obdaBrazilian, obdaItalian, obdaEmployee, obdaPersonal, 
  obdaCorporate, obdaContractor, obdaChild, obdaAdult, obdaEmployment, obdaEnrollment, abdaContract];

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlappig = false;
const complete = true;
const incomplete = false;

const project = new Project();
project.setName('RunExample');
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
  project,
  scripts,
  obdaMapping,
};
