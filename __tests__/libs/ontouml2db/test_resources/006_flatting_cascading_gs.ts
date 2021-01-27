import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_006_flatting_cascading_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', true))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_a', true))
      .addProperty(new PropertyChecker('address', false))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntityB', 'person'))
  .addTracker(new TrackerChecker('NamedEntityA', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'));

const jsonModel = require('./test_006_flatting_cascading_gs.json');

export const test_006: TestResource = {
  title: '006 Evaluates the flattening involving a generalization set, where the subclasses are superclasses of other classes',
  checker: gChecker_006_flatting_cascading_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
