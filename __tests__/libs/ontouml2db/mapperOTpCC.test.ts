/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { Ontouml2Db } from '@libs/ontouml2db/Ontouml2Db';
import { GraphChecker } from './test_resources/graph_tester/GraphChecker';
import { NodeChecker } from './test_resources/graph_tester/NodeChecker';
import { PropertyChecker } from './test_resources/graph_tester/PropertyChecker';
import { RelationshipChecker } from './test_resources/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './test_resources/graph_tester/TrackerChecker';
import { Project } from '@libs/ontouml';
import { ScriptChecker } from './test_resources/graph_tester/ScriptChecker';

let options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_CONCRETE_CLASS,
  targetDBMS: DbmsSupported.GENERIC_SCHEMA,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: true
};
// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************

const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptPrimarySchool =
  'CREATE TABLE primary_school ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        playground_size         INTEGER        NULL' +
  '); ';

const scriptHospital =
  'CREATE TABLE hospital ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        capacity                INTEGER        NULL' +
  '); ';

const scriptBrazilianCitizen =
  'CREATE TABLE brazilian_citizen ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        rg                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptItalianCitizen =
  'CREATE TABLE italian_citizen ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        ci                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptEmployee = 'CREATE TABLE employee ( ' + '         person_id              INTEGER        NOT NULL PRIMARY KEY' + '); ';

const scriptPersonalCustomer =
  'CREATE TABLE personal_customer ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_rating           DOUBLE         NOT NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  '); ';

const scriptCorporateCustomer =
  'CREATE TABLE corporate_customer ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_rating           DOUBLE         NOT NULL' +
  ',        credit_limit            DOUBLE         NOT NULL' +
  '); ';

const scriptContractor =
  'CREATE TABLE contractor ( ' + '         organization_id         INTEGER        NOT NULL PRIMARY KEY' + ');';

const scripChild = 'CREATE TABLE child ( ' + '         person_id                 INTEGER        NOT NULL PRIMARY KEY' + ');';

const scriptAdult = 'CREATE TABLE adult ( ' + '         person_id                 INTEGER        NOT NULL PRIMARY KEY' + ');';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',       organization_id         INTEGER        NOT NULL' +
  ',       person_id              INTEGER        NOT NULL' +
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

const scriptFKPrimatyOrgnization =
  'ALTER TABLE primary_school ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKHospitalOrganization =
  'ALTER TABLE hospital ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKBrazilianPerson = 'ALTER TABLE brazilian_citizen ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKItalianPerson = 'ALTER TABLE italian_citizen ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKEmployeAdult = 'ALTER TABLE employee ADD FOREIGN KEY ( person_id ) REFERENCES adult ( person_id );';

const scritpFKPersonalCustomerAdult =
  'ALTER TABLE personal_customer ADD FOREIGN KEY ( person_id ) REFERENCES adult ( person_id );';

const scriptFKCorporateOrganization =
  'ALTER TABLE corporate_customer ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKContractorOrganization =
  'ALTER TABLE contractor ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKChildPerson = 'ALTER TABLE child ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKAdultPerson = 'ALTER TABLE adult ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKEmploymentOrganization =
  'ALTER TABLE employment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKEmploymentEmployee = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES employee ( person_id );';

const scriptFKEnrollmentSchool =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( organization_id ) REFERENCES primary_school ( organization_id );';

const scriptFKEnrollmentChild = 'ALTER TABLE enrollment ADD FOREIGN KEY ( person_id ) REFERENCES child ( person_id );';

const scriptFKSupplyCorporateCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_customer_id ) REFERENCES corporate_customer ( organization_id );';

const scriptFKSupplyPersonalCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( person_id ) REFERENCES personal_customer ( person_id );';

const scriptFKSupplyContractor =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_id ) REFERENCES contractor ( organization_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const graphChecker: GraphChecker = new GraphChecker()

  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('brazilian_citizen')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('rg', false))
  )
  .addNode(
    new NodeChecker('italian_citizen')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('ci', false))
  )
  .addNode(new NodeChecker('child').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('adult').addProperty(new PropertyChecker('person_id', false)))
  .addNode(new NodeChecker('employee').addProperty(new PropertyChecker('person_id', false)))
  .addNode(
    new NodeChecker('primary_school')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('playground_size', true))
  )
  .addNode(
    new NodeChecker('hospital')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('capacity', true))
  )
  .addNode(new NodeChecker('contractor').addProperty(new PropertyChecker('organization_id', false)))
  .addNode(
    new NodeChecker('personal_customer')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('credit_rating', false))
      .addProperty(new PropertyChecker('credit_card', true))
  )
  .addNode(
    new NodeChecker('corporate_customer')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('credit_rating', false))
      .addProperty(new PropertyChecker('credit_limit', false))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('salary', false))
  )
  .addNode(
    new NodeChecker('supply_contract')
      .addProperty(new PropertyChecker('supply_contract_id', false))
      .addProperty(new PropertyChecker('organization_customer_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('contract_value', false))
  )
  .addNode(
    new NodeChecker('enrollment')
      .addProperty(new PropertyChecker('enrollment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('grade', false))
  )
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'brazilian_citizen', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'italian_citizen', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'child', Cardinality.C1))
  .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'adult', Cardinality.C1))
  .addRelationship(new RelationshipChecker('adult', Cardinality.C1, 'employee', Cardinality.C1))
  .addRelationship(new RelationshipChecker('adult', Cardinality.C1, 'personal_customer', Cardinality.C1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'corporate_customer', Cardinality.C1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'primary_school', Cardinality.C1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'hospital', Cardinality.C1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'contractor', Cardinality.C1))
  .addRelationship(new RelationshipChecker('enrollment', Cardinality.C0_N, 'child', Cardinality.C1))
  .addRelationship(new RelationshipChecker('employee', Cardinality.C1, 'employment', Cardinality.C1_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('primary_school', Cardinality.C1, 'enrollment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('contractor', Cardinality.C1, 'supply_contract', Cardinality.C1_N))
  .addRelationship(new RelationshipChecker('corporate_customer', Cardinality.C0_1, 'supply_contract', Cardinality.C1_N))
  .addRelationship(new RelationshipChecker('personal_customer', Cardinality.C0_1, 'supply_contract', Cardinality.C1_N))

  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'brazilian_citizen'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'italian_citizen'))
  .addTracker(new TrackerChecker('Child', 'child'))
  .addTracker(new TrackerChecker('Adult', 'adult'))
  .addTracker(new TrackerChecker('Employee', 'employee'))
  .addTracker(new TrackerChecker('Customer', 'personal_customer'))
  .addTracker(new TrackerChecker('Customer', 'corporate_customer'))
  .addTracker(new TrackerChecker('PersonalCustomer', 'personal_customer'))
  .addTracker(new TrackerChecker('CorporateCustomer', 'corporate_customer'))
  .addTracker(new TrackerChecker('Employment', 'employment'))
  .addTracker(new TrackerChecker('SupplyContract', 'supply_contract'))
  .addTracker(new TrackerChecker('Contractor', 'contractor'))
  .addTracker(new TrackerChecker('PrimarySchool', 'primary_school'))
  .addTracker(new TrackerChecker('Hospital', 'hospital'))
  .addTracker(new TrackerChecker('Enrollment', 'enrollment'))
  .setNumberOfTablesToFindInScript(15)
  .setNumberOfFkToFindInScript(17)

  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptPrimarySchool, 'The PRYMARY_SCHOOL table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptHospital, 'The HOSPITAL table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptBrazilianCitizen, 'The BRAZILIAN_CITIZEN table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptItalianCitizen, 'The ITALIAN_CITIZEN table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployee, 'The EMPLOYEE table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptPersonalCustomer, 'The PERSONAL_CUSTOMER table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptCorporateCustomer, 'The CORPORATE_CUSTOMER table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptContractor, 'The CONTRACTOR table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scripChild, 'The CHILD table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptAdult, 'The ADULT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEnrollment, 'The ENROLLMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptSupply, 'The SUPPLY_CONTRACT table is different than expected.'))

  .addScriptChecker(
    new ScriptChecker(
      scriptFKPrimatyOrgnization,
      'The FK between PRIMARY_SCHOOL and ORGANIZATION not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKHospitalOrganization,
      'The FK between HOSPITAL and ORGANIZATION not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKBrazilianPerson,
      'The FK between BRAZILIAN_CITIZEN and PERSON not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKItalianPerson,
      'The FK between ITALIAN_CITIZEN and PERSON not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKEmployeAdult, 'The FK between EMPLOYEE and ADULT not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scritpFKPersonalCustomerAdult,
      'The FK between PERSONAL_CUSTOMER and ADULT not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKCorporateOrganization,
      'The FK between CORPORATE_CUSTOMER and ORGANIZATION not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKContractorOrganization,
      'The FK between CONTRACTOR and ORGANIZATION not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKChildPerson, 'The FK between CHILD and PERSON not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKAdultPerson, 'The FK between ADULT and PERSON not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEmploymentOrganization,
      'The FK between EMPLOYMENT and ORGANIZATINO not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEmploymentEmployee,
      'The FK between EMPLOYMENT and EMPLOYEE not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKEnrollmentSchool, 'The FK between ENROLLMENT and SCHOOL not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKEnrollmentChild, 'The FK between ENROLLMENT and CHILD not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyContractor,
      'The FK between SUPPLAY_CONTRACT and CONTRACTOR not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyCorporateCustomer,
      'The FK between SUPPLAY_CONTRACT and CORPORATE_CUSTOMER not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyPersonalCustomer,
      'The FK between SUPPLAY_CONTRACT and PERSONAL_CUSTOMER not exists or is different than expected.'
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
model.createMediationRelation(enrollment, primarySchool, 'hasPrimatySchool');
model.createMediationRelation(supplyConstract, contractor, 'hasContractor');
model.createMediationRelation(supplyConstract, customer, 'hasCustomer');

// ****************************************

test('Run Example', () => {
  let service: Ontouml2Db;
  let files;

  expect(() => {
    service = new Ontouml2Db(project, options);
    files = service.run();
  }).not.toThrow();

  graphChecker.setTransformation(service);
  graphChecker.setSchema(files.result.schema);

  expect(graphChecker.check()).toBe('');
});
