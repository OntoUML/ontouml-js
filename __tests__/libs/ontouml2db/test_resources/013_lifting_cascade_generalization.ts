import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_013_lifting_cascade_generalization = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test_role_x', true))
      .addProperty(new PropertyChecker('test_employee', true))
      .addProperty(new PropertyChecker('is_role_x', false))
      .addProperty(new PropertyChecker('is_employee', false))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('RoleX', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'));

const jsonModel = require('./test_013_lifting_cascade_generalization.json');

export const test_013: TestResource = {
  title: '013 Evaluate the lifting with cascading generalizations',
  checker: gChecker_013_lifting_cascade_generalization,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
