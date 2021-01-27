import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

it('should ignore', () => {
  expect(true).toBe(true);
});

const jsonModel = require('./test_002_flatting_with_duplicate_attributes.json');

const gChecker_002_flatting_with_duplicate_attributes = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('x1', true))
      .addProperty(new PropertyChecker('x2', true))
      .addProperty(new PropertyChecker('x3', true)),
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('Person', 'person'));

export const test_002: TestResource = {
  title:
    '002 - Evaluates flattening involving only one generalization where there are attributes with the same name in the superclass and subclass',
  checker: gChecker_002_flatting_with_duplicate_attributes,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel),
};
