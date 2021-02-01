import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

const gChecker_019_lifting_generalization_and_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('rg', true))
      .addProperty(new PropertyChecker('ci', true))
      .addProperty(new PropertyChecker('is_brazilian_citizen', false))
      .addProperty(new PropertyChecker('is_italian_citizen', false))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
  )
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'));

const jsonModel = require('./test_019_lifting_generalization_and_gs.json');

export const test_019: TestResource = {
  title: '019 Evaluate the lifting with one generalization set and two simple generalizations',
  checker: gChecker_019_lifting_generalization_and_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
