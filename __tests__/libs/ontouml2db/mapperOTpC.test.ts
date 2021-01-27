/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { baseExample } from './../ontouml2db/test_resources/baseExample';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import { GraphChecker } from './test_resources/graph_tester/GraphChecker';
import { NodeChecker } from './test_resources/graph_tester/NodeChecker';
import { PropertyChecker } from './test_resources/graph_tester/PropertyChecker';
import { RelationshipChecker } from './test_resources/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './test_resources/graph_tester/TrackerChecker';

let options: OntoUML2DBOptions = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_CLASS,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

test('Run Example', () => {
  let mapper = new OntoUML2DB(baseExample.modelManager, options);

  let script = mapper.getRelationalSchema();

  let graphChecker = new GraphChecker()
    .addNode(
      new NodeChecker('named_entity')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('name', false))
    )

    .addNode(
      new NodeChecker('person')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('birth_date', false))
    )
    .addNode(
      new NodeChecker('organization')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('address', false))
    )
    .addNode(
      new NodeChecker('brazilian_citizen')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('rg', false))
    )
    .addNode(
      new NodeChecker('italian_citizen')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('ci', false))
    )
    .addNode(new NodeChecker('child').addProperty(new PropertyChecker('named_entity_id', false)))
    .addNode(new NodeChecker('adult').addProperty(new PropertyChecker('named_entity_id', false)))
    .addNode(new NodeChecker('employee').addProperty(new PropertyChecker('named_entity_id', false)))
    .addNode(
      new NodeChecker('primary_school')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('playground_size', true))
    )
    .addNode(
      new NodeChecker('hospital')
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('capacity', true))
    )
    .addNode(new NodeChecker('contractor').addProperty(new PropertyChecker('named_entity_id', false)))
    .addNode(
      new NodeChecker('customer')
        .addProperty(new PropertyChecker('customer_id', false))
        .addProperty(new PropertyChecker('credit_rating', false))
    )
    .addNode(
      new NodeChecker('personal_customer')
        .addProperty(new PropertyChecker('customer_id', false))
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('credit_card', true))
    )
    .addNode(
      new NodeChecker('corporate_customer')
        .addProperty(new PropertyChecker('customer_id', false))
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('credit_limit', false))
    )
    .addNode(
      new NodeChecker('employment')
        .addProperty(new PropertyChecker('employment_id', false))
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('named_entity_organization_id', false))
        .addProperty(new PropertyChecker('salary', false))
    )
    .addNode(
      new NodeChecker('supply_contract')
        .addProperty(new PropertyChecker('supply_contract_id', false))
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('customer_id', false))
        .addProperty(new PropertyChecker('contract_value', false))
    )
    .addNode(
      new NodeChecker('enrollment')
        .addProperty(new PropertyChecker('enrollment_id', false))
        .addProperty(new PropertyChecker('named_entity_id', false))
        .addProperty(new PropertyChecker('named_entity_child_id', false))
        .addProperty(new PropertyChecker('grade', false))
    )
    .addRelationship(new RelationshipChecker('named_entity', Cardinality.C1, 'person', Cardinality.C1))
    .addRelationship(new RelationshipChecker('named_entity', Cardinality.C1, 'organization', Cardinality.C1))
    .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'brazilian_citizen', Cardinality.C1))
    .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'italian_citizen', Cardinality.C1))
    .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'child', Cardinality.C1))
    .addRelationship(new RelationshipChecker('person', Cardinality.C1, 'adult', Cardinality.C1))
    .addRelationship(new RelationshipChecker('adult', Cardinality.C1, 'employee', Cardinality.C1))
    .addRelationship(new RelationshipChecker('adult', Cardinality.C1, 'personal_customer', Cardinality.C1))
    .addRelationship(new RelationshipChecker('customer', Cardinality.C1, 'personal_customer', Cardinality.C1))
    .addRelationship(new RelationshipChecker('customer', Cardinality.C1, 'corporate_customer', Cardinality.C1))
    .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'corporate_customer', Cardinality.C1))
    .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'primary_school', Cardinality.C1))
    .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'hospital', Cardinality.C1))
    .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'contractor', Cardinality.C1))
    .addRelationship(new RelationshipChecker('enrollment', Cardinality.C0_N, 'child', Cardinality.C1))
    .addRelationship(new RelationshipChecker('employee', Cardinality.C1, 'employment', Cardinality.C1_N))
    .addRelationship(new RelationshipChecker('supply_contract', Cardinality.C1_N, 'customer', Cardinality.C1))
    .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'employment', Cardinality.C0_N))
    .addRelationship(new RelationshipChecker('contractor', Cardinality.C1, 'supply_contract', Cardinality.C1_N))

    .addRelationship(new RelationshipChecker('primary_school', Cardinality.C1, 'enrollment', Cardinality.C0_N))

    .addTracker(new TrackerChecker('NamedEntity', 'named_entity'))
    .addTracker(new TrackerChecker('Person', 'person'))
    .addTracker(new TrackerChecker('Organization', 'organization'))
    .addTracker(new TrackerChecker('BrazilianCitizen', 'brazilian_citizen'))
    .addTracker(new TrackerChecker('ItalianCitizen', 'italian_citizen'))
    .addTracker(new TrackerChecker('Child', 'child'))
    .addTracker(new TrackerChecker('Adult', 'adult'))
    .addTracker(new TrackerChecker('Employee', 'employee'))
    .addTracker(new TrackerChecker('Customer', 'customer'))
    .addTracker(new TrackerChecker('PersonalCustomer', 'personal_customer'))
    .addTracker(new TrackerChecker('CorporateCustomer', 'corporate_customer'))
    .addTracker(new TrackerChecker('Employment', 'employment'))
    .addTracker(new TrackerChecker('SupplyContract', 'supply_contract'))
    .addTracker(new TrackerChecker('Contractor', 'contractor'))
    .addTracker(new TrackerChecker('PrimarySchool', 'primary_school'))
    .addTracker(new TrackerChecker('Hospital', 'hospital'))
    .addTracker(new TrackerChecker('Enrollment', 'enrollment'));

  graphChecker.setTransformation(mapper);

  let result = graphChecker.check();

  if (result != '') {
    console.log(result);
    console.log(mapper.getSourceGraph().toString());
    //console.log(mapper.getTracker().toString());
    expect(result).toBe('');
  }
});
