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
 import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
 import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
 
 // ****************************************
 //       FOR SCHEMA VALIDATION
 // ****************************************
 const scriptPerson =
   'CREATE TABLE IF NOT EXISTS person ( ' +
   '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
   ',        life_phase_id           INTEGER        NOT NULL' +
   ',        birth_date              DATE           NOT NULL' +
   ',        rg                      VARCHAR(20)    NULL' +
   ',        ci                      VARCHAR(20)    NULL' +
   '); ';
 
 const scriptNationality =
   'CREATE TABLE IF NOT EXISTS nationality ( ' +
   '         nationality_id          INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
   ',        nationality             VARCHAR(20)    NOT NULL' +
   '); ';

 const scriptLifePhase =
   'CREATE TABLE IF NOT EXISTS life_phase ( ' +
   '         life_phase_id           INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
   ',        life_phase              VARCHAR(20)    NOT NULL' +
   '); ';
   
 const scriptNationalityPerson =
   'CREATE TABLE IF NOT EXISTS nationality_person ( ' +
   '         nationality_person_id   INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
   ',        person_id               INTEGER        NOT NULL' +
   ',        nationality_id          INTEGER        NOT NULL' +
   '); ';

 const scriptFKPersonLifePhase = 'ALTER TABLE person ADD FOREIGN KEY ( life_phase_id ) REFERENCES life_phase ( life_phase_id )';

 const scriptFKNationalityPersonPerson = 'ALTER TABLE nationality_person ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';
 
 const scriptFKNationalityNationalityPerson =
   'ALTER TABLE nationality_person ADD FOREIGN KEY ( nationality_id ) REFERENCES nationality ( nationality_id )';
 
  
 // ****************************************
 //       CHECK RESULTING GRAPH
 // ****************************************
 const gChecker_run_example = new GraphChecker()
   .addNode(
     new NodeChecker('person')
       .addProperty(new PropertyChecker('person_id', false))
       .addProperty(new PropertyChecker('life_phase_id', false))
       .addProperty(new PropertyChecker('birth_date', false))
       .addProperty(new PropertyChecker('rg', true))
       .addProperty(new PropertyChecker('ci', true))
   )
   .addNode(new NodeChecker('life_phase')
        .addProperty(new PropertyChecker('life_phase_id', false))
        .addProperty(new PropertyChecker('life_phase', false))
    )
   .addNode(new NodeChecker('nationality')
       .addProperty(new PropertyChecker('nationality_id', false))
       .addProperty(new PropertyChecker('nationality', false))
   )
   .addNode(new NodeChecker('nationality_person')
       .addProperty(new PropertyChecker('nationality_person_id', false))
       .addProperty(new PropertyChecker('person_id', false))
       .addProperty(new PropertyChecker('nationality_id', false))
   )
   .addRelationship(new RelationshipChecker('nationality', Cardinality.C1, 'nationality_person', Cardinality.C0_N))
   .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'nationality_person', Cardinality.C0_N))
   .addRelationship(new RelationshipChecker('life_phase', Cardinality.C1, 'person', Cardinality.C0_N))
 
   .addTracker(new TrackerChecker('Person', 'person'))
   .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
   .addTracker(new TrackerChecker('ItalianCitizen', 'person'))
   .addTracker(new TrackerChecker('Child', 'person'))
   .addTracker(new TrackerChecker('Adult', 'person'))
   .addTracker(new TrackerChecker('NationalityPerson', 'nationality_person'))

   .setNumberOfTablesToFindInScript(4)
   .setNumberOfFkToFindInScript(3)
   .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
   .addScriptChecker(new ScriptChecker(scriptNationality, 'The NATIOINALITY table is different than expected.'))
   .addScriptChecker(new ScriptChecker(scriptLifePhase, 'The LIFE_PHASE table is different than expected.'))
   .addScriptChecker(new ScriptChecker(scriptNationalityPerson, 'The NATIOINALITY_PERSON table is different than expected.'))
   
   .addScriptChecker(
     new ScriptChecker(scriptFKNationalityNationalityPerson, 'The FK between NATIONALITY and NATIONALITY_PERSON not exists or is different than expected.')
    )
   .addScriptChecker(
    new ScriptChecker(scriptFKNationalityPersonPerson, 'The FK between NATIONALITY_PERSON and PERSON not exists or is different than expected.')
   )
   .addScriptChecker(
    new ScriptChecker(scriptFKPersonLifePhase, 'The FK between LIFE_PHASE and PERSON not exists or is different than expected.')
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
 // CREATE CLASSES
 const person = model.createKind('Person');
 const brazilianCitizen = model.createRole('BrazilianCitizen');
 const italianCitizen = model.createRole('ItalianCitizen');
 const child = model.createPhase('Child');
 const adult = model.createPhase('Adult');
 // CREATE PROPERTIES
 person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
 brazilianCitizen.createAttribute(_string, 'RG').cardinality.setOneToOne();
 italianCitizen.createAttribute(_string, 'CI').cardinality.setOneToOne();
 // CREATE GENERALIZATIONS
 const genPersonBrazilian = model.createGeneralization(person, brazilianCitizen);
 const genPersonItalian = model.createGeneralization(person, italianCitizen);
 const genPersonChild = model.createGeneralization(person, child);
 const genPersonAdult = model.createGeneralization(person, adult);
 // CRETATE GENERALIZATION SET
 model.createGeneralizationSet([genPersonBrazilian, genPersonItalian], overlappig, incomplete, null, 'Nationality');
 model.createGeneralizationSet([genPersonChild, genPersonAdult], disjoint, complete, null, 'LifePhase');
 
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
   enumFieldToLoocupTable: true,
 };
 
 // ****************************************
 export const test_036: TestResource = {
   title: '036 - Evaluates the transformation of enumerations into lookup tables for a specific database(H2).',
   checker: gChecker_run_example,
   project,
   options
 };
 