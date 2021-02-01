import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TestResource } from './TestResource';

const gChecker_009_flatting_with_association = new GraphChecker()
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
    new NodeChecker('person_b')
      .addProperty(new PropertyChecker('person_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', false))
      .addProperty(new PropertyChecker('birth_date_b', false))
  )
  .addNode(
    new NodeChecker('organization_b')
      .addProperty(new PropertyChecker('organization_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('organization_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('organization_b_id', true))
      .addProperty(new PropertyChecker('person_b_id', true))
  )
  .addRelationship(new RelationshipChecker('organization', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntity', 'person_b'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
  .addTracker(new TrackerChecker('NamedEntityB', 'person_b'))
  .addTracker(new TrackerChecker('NamedEntityB', 'organization_b'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('PersonB', 'person_b'))
  .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
  .addTracker(new TrackerChecker('Test', 'test'));

const jsonModel = require('./test_009_flatting_with_association.json');

export const test_009: TestResource = {
  title: '009 Evaluates the flattening involving a generalization set and a hierarchy of nonSortals',
  checker: gChecker_009_flatting_with_association,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
