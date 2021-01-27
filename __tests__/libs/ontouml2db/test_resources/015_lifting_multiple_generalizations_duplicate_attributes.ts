import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const gChecker_015_lifting_multiple_generalizations_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('test1', true))
      .addProperty(
        new PropertyChecker('person_phase_enum', false, ['CHILD', 'ADULT']),
      ),
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'));

const jsonModel = require('./test_015_lifting_multiple_generalizations_duplicate_attributes.json');

export const test_015: TestResource = {
  title:
    '015 Evaluate the survey with a generalization set with the attribute name repeated in both subclasses',
  checker: gChecker_015_lifting_multiple_generalizations_duplicate_attributes,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
