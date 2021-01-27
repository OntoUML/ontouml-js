import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const jsonModel = require('./test_003_flatting_gs.json');

const gChecker_003_flatting_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', true))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', true))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'));

export const test_003: TestResource = {
  title: '003 Evaluates flattening involving only one generalizations set',
  checker: gChecker_003_flatting_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
