import { ModelManager } from '@libs/model';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';

const gChecker_018_lifting_orthogonal_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('birth_date', false))
      .addProperty(new PropertyChecker('rg', true))
      .addProperty(new PropertyChecker('ci', true))
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'TEENAGER', 'ADULT']))
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('nationality_enum', false, ['BRAZILIANCITIZEN', 'ITALIANCITIZEN']))
  )
  .addRelationship(new RelationshipChecker('nationality', Cardinality.C0_N, 'person', Cardinality.C1))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Adult', 'person'))
  .addTracker(new TrackerChecker('Teenager', 'person'))
  .addTracker(new TrackerChecker('Child', 'person'))
  .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
  .addTracker(new TrackerChecker('ItalianCitizen', 'person'));

const jsonModel = require('./test_018_lifting_orthogonal_gs.json');

export const test_018: TestResource = {
  title: '018 Evaluate the lifting with orthogonal generalization sets',
  checker: gChecker_018_lifting_orthogonal_gs,
  model: jsonModel,
  modelManager: new ModelManager(jsonModel)
};
