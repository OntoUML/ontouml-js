import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

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
      .addProperty(
        new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']),
      ),
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
      .addProperty(
        new PropertyChecker('organization_type_enum', true, [
          'PRIMARYSCHOOL',
          'HOSPITAL',
        ]),
      ),
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('salary', false)),
  )
  .addNode(
    new NodeChecker('supply_contract')
      .addProperty(new PropertyChecker('supply_contract_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('organization_customer_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('contract_value', false)),
  )
  .addNode(
    new NodeChecker('enrollment')
      .addProperty(new PropertyChecker('enrollment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('grade', false)),
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(
        new PropertyChecker('nationality_enum', false, [
          'BRAZILIANCITIZEN',
          'ITALIANCITIZEN',
        ]),
      ),
  )
  .addRelationship(
    new RelationshipChecker(
      'nationality',
      Cardinality.C0_N,
      'person',
      Cardinality.C1,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'enrollment',
      Cardinality.C0_N,
      'person',
      Cardinality.C1,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'employment',
      Cardinality.C0_N,
      'person',
      Cardinality.C1,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'supply_contract',
      Cardinality.C0_N,
      'person',
      Cardinality.C0_1,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'organization',
      Cardinality.C1,
      'employment',
      Cardinality.C0_N,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'organization',
      Cardinality.C1,
      'supply_contract',
      Cardinality.C0_N,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'organization',
      Cardinality.C0_1,
      'supply_contract',
      Cardinality.C0_N,
    ),
  )
  .addRelationship(
    new RelationshipChecker(
      'organization',
      Cardinality.C1,
      'enrollment',
      Cardinality.C0_N,
    ),
  )

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
  .addTracker(new TrackerChecker('Enrollment', 'enrollment'));

export const baseExample: TestResource = {
  title: 'Base Example Test',
  checker: gChecker_run_example,
  model: require('./baseExample.json'),
};
