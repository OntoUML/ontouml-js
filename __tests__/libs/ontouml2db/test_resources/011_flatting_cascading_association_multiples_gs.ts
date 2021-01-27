import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_011_flatting_cascading_association_multiples_gs = new GraphChecker()
  .addNode(
    new NodeChecker('organization_a')
      .addProperty(new PropertyChecker('organization_a_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('organization_b')
      .addProperty(new PropertyChecker('organization_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('organization_c')
      .addProperty(new PropertyChecker('organization_c_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('organization_d')
      .addProperty(new PropertyChecker('organization_d_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('test1', false))
      .addProperty(new PropertyChecker('organization_a_id', true))
      .addProperty(new PropertyChecker('organization_b_id', true))
      .addProperty(new PropertyChecker('organization_c_id', true))
      .addProperty(new PropertyChecker('organization_d_id', true))
  )
  .addRelationship(new RelationshipChecker('organization_a', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_c', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_d', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_a'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_c'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_d'))
  .addTracker(new TrackerChecker('OrganizationA', 'organization_a'))
  .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
  .addTracker(new TrackerChecker('OrganizationC', 'organization_c'))
  .addTracker(new TrackerChecker('OrganizationD', 'organization_d'))
  .addTracker(new TrackerChecker('Test', 'test'));

const jsonModel = require('./test_011_flatting_cascading_association_multiples_gs.json');

export const test_011: TestResource = {
  title: '011 Evaluates the flatting with one association and multiples generalization sets',
  checker: gChecker_011_flatting_cascading_association_multiples_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};