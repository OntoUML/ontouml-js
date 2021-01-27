import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_012_simple_lifting = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test', true))
      .addProperty(new PropertyChecker('is_employee', false)),
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'));

const jsonModel = require('./test_012_simple_lifting.json');

export const test_012: TestResource = {
  title: '012 Evaluates the lifting with a simple generalization',
  checker: gChecker_012_simple_lifting,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
