import { ModelManager } from 'src';
import { GraphChecker } from './graph_tester/GraphChecker';

it('should ignore', () => {
  expect(true).toBe(true);
});

export interface TestResource {
  title: string;
  model: object;
  checker: GraphChecker;
  modelManager: ModelManager;
}
