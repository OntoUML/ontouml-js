import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const jsonModel = require('./test_005_flatting_orthogonal_gs.json');

const gChecker_005_flatting_orthogonal_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false)),
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false)),
  )
  .addNode(
    new NodeChecker('person_x')
      .addProperty(new PropertyChecker('person_x_id', false))
      .addProperty(new PropertyChecker('name', false)),
  )
  .addNode(
    new NodeChecker('organization_x')
      .addProperty(new PropertyChecker('organization_x_id', false))
      .addProperty(new PropertyChecker('name', false)),
  )
  .addNode(
    new NodeChecker('test_x')
      .addProperty(new PropertyChecker('test_x_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('test', true)),
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntity', 'person_x'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_x'))
  .addTracker(new TrackerChecker('NamedEntity', 'test_x'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('PersonX', 'person_x'))
  .addTracker(new TrackerChecker('OrganizationX', 'organization_x'))
  .addTracker(new TrackerChecker('TestX', 'test_x'));

export const test_005: TestResource = {
  title:
    '005 Evaluates flattening involving two orthogonal generalizations sets to each other',
  checker: gChecker_005_flatting_orthogonal_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
