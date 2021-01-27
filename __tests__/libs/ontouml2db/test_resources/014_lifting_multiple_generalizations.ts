import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_014_lifting_multiple_generalizations = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test1', true))
      .addProperty(new PropertyChecker('test2', true))
      .addProperty(new PropertyChecker('test3', true))
      .addProperty(new PropertyChecker('is_employee', false))
      .addProperty(new PropertyChecker('is_role_x', false))
      .addProperty(new PropertyChecker('is_role_y', false)),
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('RoleX', 'person'))
  .addTracker(new TrackerChecker('RoleY', 'person'))
  .addTracker(new TrackerChecker('Employee', 'person'));

const jsonModel = require('./test_014_lifting_multiple_generalizations.json');

export const test_014: TestResource = {
  title:
    '014 Evaluate the lifting with multiple generalizations, without forming a generalization set',
  checker: gChecker_014_lifting_multiple_generalizations,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
