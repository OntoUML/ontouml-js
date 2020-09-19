import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';
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

export const test_014: TestResource = {
  title:
    '014 Evaluate the lifting with multiple generalizations, without forming a generalization set',
  model: require('./test_014_lifting_multiple_generalizations.json'),
  checker: gChecker_014_lifting_multiple_generalizations,
};
